using System;
using System.Buffers;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace Api.WebData.Store
{
    public class DataBufferWriter : IBufferWriter<byte>, IDisposable
    {
        private readonly byte[] rentedBuffer;
        private readonly Func<bool> flush;
        private int written;

        public DataBufferWriter(int initialCapacity, Func<bool> flush)
        {
            this.rentedBuffer = ArrayPool<byte>.Shared.Rent(initialCapacity);
            this.written = 0;
            this.flush = flush;
        }

        public Memory<byte> WrittenMemory => rentedBuffer.AsMemory(0, written);

        public int WrittenCount => written;

        public void Advance(int count)
        {
            var result = written + count;
            if (result >= 0 && result < rentedBuffer.Length)
                written = result;
        }

        public void Consume(int count)
        {
            //if (count > written)
            //    throw new InvalidOperationException("Cannot consume more than written.");
            //for(int i=count; i<written ; i++)
            //{
            //    // var n = i - count;
            //    // rentedBuffer[i - count] = rentedBuffer[i];
            //}
            if (count < written)
            {
                Array.Copy(rentedBuffer, count, rentedBuffer, 0, written - count);
                written -= count;
            }
            else
            {
                written = 0;
            }
        }

        public Memory<byte> GetMemory(int sizeHint = 0)
        {
            CheckAvailable(sizeHint);
            return rentedBuffer.AsMemory(written);
        }

        public Span<byte> GetSpan(int sizeHint = 0)
        {
            CheckAvailable(sizeHint);
            return rentedBuffer.AsSpan(written, sizeHint);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private bool CheckAvailable(int sizeHint)
        {
            return sizeHint <= (rentedBuffer.Length - written) || flush();
        }
        private bool CheckAvailable(uint sizeHint)
        {
            return sizeHint <= (rentedBuffer.Length - written) || flush();
        }

        public void Write(in Span<byte> bytes)
        {
            var size = (uint)bytes.Length;
            CheckAvailable(size);

            ref var dest = ref rentedBuffer[written];
            ref var src = ref bytes[0];

            Unsafe.CopyBlockUnaligned(ref dest, ref src, size);
            written += bytes.Length;
        }

        public void Write<T>(in T value) where T : struct
        {
            var size = Unsafe.SizeOf<T>();
            CheckAvailable(size);

            ref var dest = ref rentedBuffer[written];
            Unsafe.WriteUnaligned<T>(ref dest, value);
            written += size;
        }

        public void Dispose()
        {
            ArrayPool<byte>.Shared.Return(rentedBuffer, clearArray: false);
            written = 0;
        }

        internal void CopyTo(byte[] dest, int destinationIndex, int length)
        {
            Array.Copy(rentedBuffer, 0, dest, destinationIndex, length);
        }

    }
}
