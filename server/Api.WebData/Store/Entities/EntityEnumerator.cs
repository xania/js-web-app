using Api.WebData.Store.Records;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace Api.WebData.Store.Entities
{
    public interface IEntityEnumerator<T> : IDisposable
    {
        bool TryMoveNext(EntityFunc<T, bool> predicate);
        IEntity<T> Current { get; }
    }

    public struct EntityEnumerator<T> : IEntityEnumerator<T>, IEntity<T>
    {
        private readonly DataStore store;
        private RecordEnumerator recordEnumerator;
        private readonly EntityHashSet distinct;

        public EntityEnumerator(DataStore store)
        {
            this.store = store;
            this.distinct = new EntityHashSet(1024);
            this.recordEnumerator = this.store.GetEnumerator();
        }

        public unsafe RecordHandle Handle => new RecordHandle(recordEnumerator.Record);

        public Guid Id => recordEnumerator.Read<Guid>(0);

        public IEntity<T> Current => this;

        public bool IsEmpty => recordEnumerator.RecordLength <= Entity.ContentOffset;

        public unsafe long Version => Entity.GetVersion(recordEnumerator.Record);

        public T Content => Entity.GetContent<T>(ContentSpan);

        public ReadOnlySpan<byte> ContentSpan => recordEnumerator.AsReadOnlySpan(Entity.ContentOffset);

        public unsafe bool Contains(ref byte utf8Text, int length)
        {
            var recordLength = recordEnumerator.GetRecordLength();
            var contentLength = recordLength - Entity.ContentOffset;
            if (contentLength < length)
                return false;
            ref var contentRef = ref recordEnumerator.GetPinnableReference(Entity.ContentOffset);
            var contains = RecordHelpers.IndexOf(ref contentRef, contentLength, ref utf8Text, length) >= 0;
            if (contains)
            {
                var reader = new Utf8JsonReader(ContentSpan);
                while (reader.Read())
                {
                    if (reader.TokenType == JsonTokenType.String)
                    {
                        if (reader.ValueSpan.IndexOf(utf8Text) >= 0)
                            return true;
                    }
                }
            }
            return false;
        }

        public unsafe bool TryMoveNext(EntityFunc<T, bool> predicate)
        {
            while (true)
            {
                while (recordEnumerator.TryMoveNext())
                {
                    if (recordEnumerator.SequenceEqual(Entity.ContentOffset, Entity.NULL))
                        continue;
                    var id = recordEnumerator.Read<Guid>(0);
                    var version = recordEnumerator.Read<long>(sizeof(Guid));
                    if (version < 0)
                    {
                        // updated record
                        if (!distinct.Add(id))
                            // but not the last
                            continue;
                    }
                    else if (distinct.Contains(id))
                        // first record before any update
                        continue;

                    if (predicate == null)
                        return true;

                    if (predicate(this))
                        return true;
                }

                return false;
            }
        }

        public void Dispose()
        {
            // recordEnumerator.Dispose();
        }

        public IEntity<U> Cast<U>()
        {
            return Current.Cast<U>();
        }
    }
}
