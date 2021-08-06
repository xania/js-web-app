using Api.WebData.Store.Records;
using System;
using System.Buffers;
using System.Runtime.InteropServices;
using System.Text.Json;

namespace Api.WebData.Store.Entities
{
    public readonly struct EntityAdd<T> : IRecord
    {
        public EntityAdd(Guid id, in T values)
        {
            this.Id = id;
            this.Version = DateTime.UtcNow.Ticks;
            this.Content = values;
        }
        public void Serialize(IBufferWriter<byte> buffer)
        {
            var span = buffer.GetSpan(Entity.ContentOffset);
            var id = Id;
            MemoryMarshal.Write(span, ref id);
            var version = Version;
            Console.WriteLine("EntityAdd version: " + version);
            MemoryMarshal.Write(span.Slice(Entity.SizeOfId), ref version);
            buffer.Advance(Entity.ContentOffset);
            using var writer = new Utf8JsonWriter(buffer);
            JsonSerializer.Serialize<T>(writer, this.Content);
        }

        public readonly Guid Id;
        public readonly long Version;
        public readonly T Content;
    }


}
