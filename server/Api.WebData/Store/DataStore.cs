using Api.WebData.Store.Records;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;

namespace Api.WebData.Store
{
    public class DataStore: IDisposable
    {
        public const uint Magic = 0x0AF93D8A;
        public string BaseDir { get; }
        public string Name { get; }
        public DataStoreMeta Meta { get; }
        private DataBufferWriter buffer;
        private int committedBytes;
        private int commitedRecords;

        public DataStore(string baseDir, string name)
        {
            BaseDir = baseDir;
            Name = name;
            Meta = DataStoreMeta.Create(Path.Combine(BaseDir, $"{Name}.dsm"));

            buffer = new DataBufferWriter(4096, FlushUnlocked);
        }

        public void Clear()
        {
            File.Delete($"{Path.Combine(BaseDir, Name)}.ds");
            File.Delete($"{Path.Combine(BaseDir, Name)}.dsm");
        }

        public int Count => Meta.Count;

        unsafe internal RecordEnumerator GetEnumerator()
        {
            var filePath = $"{Path.Combine(BaseDir, Name)}.ds";

            var length = Meta.Length;
            var bytes = new byte[length];
            if (length == 0)
            {
                return new RecordEnumerator((byte*)IntPtr.Zero, 0);
            }
            if (File.Exists(filePath))
            {
                using var ds = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, 4096);
                var actualRead = ds.Read(bytes, 0, Meta.CommittedLength);
            }
            var pendingLength = bytes.Length - Meta.CommittedLength;
            buffer.CopyTo(bytes, Meta.CommittedLength, pendingLength);

            return new RecordEnumerator((byte*)Unsafe.AsPointer(ref bytes[0]), length);
        }

        public void Flush()
        {
            lock (buffer)
            {
                FlushUnlocked();
            }
        }

        private bool FlushUnlocked()
        {
            if (committedBytes > 0)
            {
                var data = buffer.WrittenMemory.Span.Slice(0, committedBytes);

                var filePath = $"{Path.Combine(BaseDir, Name)}.ds";
                using var ds = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.Read, 4096);

                if (Meta.Length - Meta.CommittedLength != data.Length)
                    throw new InvalidOperationException("Pending data length unexpected!");

                Seek(ds, Meta.CommittedLength);
                ds.Write(data);
                ds.Flush();
                ds.Close();

                Meta.Commit();
                buffer.Consume(committedBytes);

                committedBytes = 0;
                commitedRecords = 0;

                return true;
            }
            return false;
        }


        private unsafe static void Seek(FileStream ds, long position)
        {
            if (position > sizeof(uint))
            {
                uint* bytes = stackalloc uint[1];
                ds.Seek(position - sizeof(int), SeekOrigin.Begin);

                if (ds.Read(new Span<byte>((byte*)bytes, sizeof(uint))) != sizeof(uint))
                    throw new InvalidOperationException("position mismatch A!");

                if (*bytes != Magic)
                    throw new InvalidOperationException("magic mismatch!");
            }
            else
            {
                Debug.Assert(ds.Position == position);
                ds.Seek(position, SeekOrigin.Begin);
            }
        }

        public void Add<TRecord>(IEnumerable<TRecord> records) where TRecord : IRecord
        {
            lock (buffer)
            {
                using var enumerator = records.GetEnumerator();
                while (enumerator.MoveNext())
                {
                    var record = enumerator.Current;
                    record.Serialize(buffer);
                    var recordLength = buffer.WrittenCount - committedBytes;

                    buffer.Write((ushort)recordLength);
                    buffer.Write(DataStore.Magic);

                    Meta.Update(buffer.WrittenCount - committedBytes, 1);

                    committedBytes = buffer.WrittenCount;
                    commitedRecords++;

                }
            }
        }

        public void Dispose()
        {
        }
    }
}
