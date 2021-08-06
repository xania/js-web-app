using Api.WebData.Store.Records;
using System;
using System.Buffers;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace Api.WebData.Store.Entities
{
    public readonly struct EntityUpdate : IRecord
    {
        public readonly Guid Id;
        public readonly byte[] Content;

        public EntityUpdate(Guid id, byte[] content)
        {
            this.Id = id;
            this.Content = content;
        }

        public void Serialize(IBufferWriter<byte> buffer)
        {
            var span = buffer.GetSpan(Entity.ContentOffset);
            var id = Id;
            MemoryMarshal.Write(span, ref id);
            var version = -DateTime.UtcNow.Ticks;

            MemoryMarshal.Write(span.Slice(Entity.SizeOfId), ref version);
            buffer.Advance(Entity.ContentOffset);
            Content.CopyTo(buffer.GetSpan(Content.Length));
            buffer.Advance(Content.Length);
        }
    }
}
