using Api.WebData.Store.Records;
using System;
using System.Collections.Generic;

namespace Api.WebData.Store.Entities.Linq
{
    public unsafe class EntityIndex<T, K> : IDisposable
    {
        private readonly IDictionary<K, RecordHandle> cached;
        private readonly EntityFunc<T, K> keySelector;
        private readonly IEntityEnumerator<T> entityEnumerator;

        public EntityIndex(IEntityEnumerator<T> entityEnumerator, EntityFunc<T, K> keySelector)
        {
            this.cached = new Dictionary<K, RecordHandle>();
            this.entityEnumerator = entityEnumerator;
            this.keySelector = keySelector;
        }

        public unsafe bool TryGetValue(K key, out IEntity<T> entity)
        {
            entity = default;
            if (cached.TryGetValue(key, out var handle))
            {
                var record = (Record*)handle.Value;
                entity = new Entity<T>(record);
                return true;
            }

            while (entityEnumerator.TryMoveNext(null))
            {
                var current = entityEnumerator.Current;
                var currentKey = this.keySelector(current);
                if (!cached.ContainsKey(currentKey))
                {
                    cached.Add(currentKey, current.Handle);
                    if (object.Equals(key, currentKey))
                    {
                        entity = current;
                        return true;
                    }
                }
            }

            return false;
        }

        public void Dispose()
        {
            entityEnumerator.Dispose();
        }
    }

}
