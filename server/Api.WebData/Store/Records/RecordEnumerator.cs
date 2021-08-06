using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace Api.WebData.Store.Records
{
    public unsafe struct RecordEnumerator
    {
        private readonly byte* buffer;
        private int recordStart;
        private ushort recordLength;

        public Record* Record => (Record*)(buffer + recordStart + recordLength);
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ReadOnlySpan<byte> AsReadOnlySpan(int offset) => new ReadOnlySpan<byte>(buffer + recordStart + offset, recordLength - offset);
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ReadOnlySpan<byte> AsReadOnlySpan(int offset, int length) => new ReadOnlySpan<byte>(buffer + recordStart + offset, length);
        public int RecordStart => recordStart;
        public int RecordLength => recordLength;
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public int GetRecordLength() => recordLength;
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref byte GetPinnableReference() => ref buffer[recordStart];
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref byte GetPinnableReference(int offset) => ref buffer[recordStart + offset];
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public T Read<T>(int offset) => Unsafe.ReadUnaligned<T>(buffer + recordStart + offset);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void CopyTo(ref byte dest)
        {
            Unsafe.CopyBlock(ref dest, ref buffer[recordStart], recordLength);
        }

        public bool SequenceEqual(int offset, byte[] bytes)
        {
            var length = bytes.Length;
            if (recordLength - offset != length)
                return false;
            for (var i = 0; i < length; i++)
            {
                if (bytes[i] != buffer[i + offset])
                    return false;
            }
            return true;
        }

        public RecordEnumerator(byte * buffer, int bufferLength)
        {
            this.buffer = buffer;
            this.recordStart = bufferLength;
            this.recordLength = 0;
            // var magic = DataStore.Magic;
            // if (!buffer.AsSpan(memoryIdx - magic.Length, magic.Length).SequenceEqual(magic))
            //    throw new InvalidOperationException("magic mismatch!");
        }

        private static readonly int[] JumpTable;

        static RecordEnumerator()
        {
            var magic = BitConverter.GetBytes(DataStore.Magic);
            var magicLength = magic.Length;
            JumpTable = new int[4096];
            Array.Fill(JumpTable, magicLength);
            for (var i = 1; i < magicLength; i++)
            {
                int m = magic[i];
                JumpTable[m] = i;
            }
        }
        public bool TryMoveNext()
        {
            if (buffer == null || recordStart <= 0)
            {
                recordLength = 0;
                return false;
            }

            var magicIdx = recordStart - sizeof(uint);
            if (*(uint*)(buffer + magicIdx) != DataStore.Magic)
                throw new Exception($"magic mismatch!");

            int lengthIdx = magicIdx - sizeof(ushort);

            ushort cappedLength = *(ushort*)(buffer + lengthIdx); //  Unsafe.ReadUnaligned<ushort>(buffer + lengthIdx);

            recordStart = lengthIdx - cappedLength;
            if (cappedLength < ushort.MaxValue)
            {
                //if (available > 0)
                //{
                //    available = EnsureBufferSize(magicLength, available);
                //    if (!buffer.AsSpan(available - magicLength, magicLength).SequenceEqual(magic))
                //    {
                //        throw new InvalidOperationException("magic mismatch");
                //    }
                //}

                recordLength = cappedLength;
                return true;
            }

            var magic = BitConverter.GetBytes(DataStore.Magic);
            int memoryEnd = lengthIdx;
            uint head = magic[0];
            int magicLength = magic.Length;
            while (recordStart-- > 0)
            {
                uint b = buffer[recordStart];
                if (b == head)
                {
                    int lastIdx = magicLength - sizeof(ushort);
                    for (var i = 1; i < magicLength; i++)
                    {
                        var m = magic[i];
                        var c = buffer[recordStart + i];
                        if (m != c)
                            break;
                        if (i == lastIdx)
                        {
                            recordStart += magicLength;
                            recordLength = checked((ushort)(memoryEnd - recordStart));
                            return true;
                        }
                    }

                    recordStart -= magicLength;
                }
                else
                {
                    var jump = JumpTable[(int)b];
                    recordStart -= jump;
                }
            }

            if (memoryEnd > 0)
            {
                recordLength = (ushort)memoryEnd;
                recordStart = 0;
                return true;
            }

            recordLength = 0;
            return false;
        }
    }
}
