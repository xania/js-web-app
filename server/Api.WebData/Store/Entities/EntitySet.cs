using Api.WebData.Store.Records;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Api.WebData.Store.Entities
{
    public interface IEntitySet<T>
    {
        EntityEnumerator<T> EnumeratorEntities();
    }

    public class EntitySet<T> : IEntitySet<T>
    {
        private readonly DataStore store;

        private static P Id<P>(P value) { return value; }

        public EntityEnumerator<T> EnumeratorEntities()
        {
            return new EntityEnumerator<T>(store);
        }

        public EntitySet(DataStore store)
        {
            this.store = store;
        }

        public int Count => store.Count;

        public IEnumerable<(Guid id, long version)> Add(params T[] items)
        {
            return Add(items.AsEnumerable());
        }

        public IEnumerable<(Guid id, long version)> Add(IEnumerable<T> items)
        {
            var entities = items.Select(item => new EntityAdd<T>(Guid.NewGuid(), item));
            return Add(entities);
        }

        public IEnumerable<(Guid id, long version)> Add(params EntityAdd<T>[] items)
        {
            return Add(items.AsEnumerable());
        }

        public IEnumerable<(Guid id, long version)> Add(IEnumerable<EntityAdd<T>> items)
        {
            var arr = items.ToList();
            store.Add(arr);
            for(var i=0;i<arr.Count;i++)
            {
                var item = arr[i];
                yield return (item.Id, item.Version);
            }
        }

        public unsafe ValueTask<T> UpdateAsync(Guid id, long version, in T values)
        {
            var recordEnumerator = store.GetEnumerator();
            while (recordEnumerator.TryMoveNext())
            {
                var record = recordEnumerator.Record;
                var recordVersion = Entity.GetVersion(record);
                if (id == Entity.GetId(record))
                {
                    if (recordVersion == version)
                    {
                        var bytes = JsonSerializer.SerializeToUtf8Bytes<T>(values);
                        using var targetDoc = JsonDocument.Parse(bytes);
                        var sourceDoc = Entity.GetContent(record);

                        if (Diff(sourceDoc, targetDoc.RootElement))
                        {
                            var update = new EntityUpdate(id, bytes);
                            store.Add(new IRecord[] { update });
                        }
                    }
                    return new ValueTask<T>(Entity.GetContent<T>(record));
                }
            }

            return default;
        }

        private bool Diff(JsonElement fromElement, JsonElement toElement)
        {
            if (fromElement.ValueKind != toElement.ValueKind)
                return true;
            if (fromElement.ValueKind == JsonValueKind.Object)
            {
                var fromProperties = fromElement.EnumerateObject().ToArray();
                var toPropertiesMap = toElement.EnumerateObject().ToDictionary(e => e.Name, StringComparer.OrdinalIgnoreCase);

                if (fromProperties.Length < toPropertiesMap.Count())
                    return true;

                foreach (var fromProperty in fromProperties)
                {
                    if (toPropertiesMap.TryGetValue(fromProperty.Name, out var toProperty))
                    {
                        if (Diff(fromProperty.Value, toProperty.Value))
                            return true;
                    }
                }
            }
            if (fromElement.ValueKind == JsonValueKind.Number || fromElement.ValueKind == JsonValueKind.String)
            {
                return !string.Equals(fromElement.GetRawText(), toElement.GetRawText());
            }
            if (fromElement.ValueKind == JsonValueKind.Array)
            {
                var fromArray = fromElement.EnumerateArray().ToArray();
                var toArray = toElement.EnumerateArray().ToArray();
                if (fromArray.Length != toArray.Length)
                    return true;

                for (var i = 0; i < fromArray.Length; i++)
                {
                    if (Diff(fromArray[i], toArray[i]))
                        return true;
                }
            }
            return false;
        }

        public IEntity<T> Find(Guid id)
        {
            using var enumerator = EnumeratorEntities();
            return enumerator.FirstOrDefault(e => e.Id == id);
        }
    }
}

