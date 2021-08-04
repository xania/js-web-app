using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Records
{
    public interface IRecord
    {
        void Serialize(System.Buffers.IBufferWriter<byte> buffer);
    }
}
