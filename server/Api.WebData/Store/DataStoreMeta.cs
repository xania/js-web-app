using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;

namespace Api.WebData.Store
{
    public class DataStoreMeta
    {
        private object _lock = new object();
        private Header? pendingHeader;
        private Header committedHeader;

        private DataStoreMeta(string filePath)
        {
            FilePath = filePath;
            committedHeader = ReadHeader(filePath) ?? new Header { Version = Version };
        }

        public string FilePath { get; }

        public const byte Version = 1;

        public int CommittedLength => committedHeader.Length;
        public int Length => pendingHeader?.Length ?? CommittedLength;

        public int CommittedCount => committedHeader.Count;
        public int Count => pendingHeader?.Count ?? CommittedCount;

        private Header Header => pendingHeader ?? committedHeader;

        private static Header? ReadHeader(string filePath)
        {
            var file = new FileInfo(filePath);
            int sizeOfHead = Marshal.SizeOf<Header>();
            if (!file.Exists || file.Length < sizeOfHead)
                return null;

            using var fs = new FileStream(file.FullName, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None, 4096);
            fs.Seek(0, SeekOrigin.Begin);
            var fileLength = fs.Length;

            var bufferLength = sizeOfHead;
            byte[] buffer = new byte[sizeOfHead];
            var length = fs.Read(buffer, 0, bufferLength);
            var header = MemoryMarshal.Read<Header>(buffer);
            return header;
        }

        public static DataStoreMeta Create(string filePath)
        {
            var file = new FileInfo(filePath);
            Directory.CreateDirectory(file.Directory.FullName);
            return new DataStoreMeta(file.FullName);
        }

        public void Update(int length, int count)
        {
            lock (_lock)
            {
                if (length == 0 || count == 0)
                    return;

                var prevHeader = Header;
                pendingHeader = new Header
                {
                    Count = prevHeader.Count + count,
                    Length = prevHeader.Length + length,
                    Version = Version
                };
            }
        }

        public void Commit()
        {
            lock (_lock)
            {
                if (pendingHeader == null)
                    return;

                var bytes = StructureToByteArray(pendingHeader.Value);
                using var dsm = new FileStream(FilePath, FileMode.OpenOrCreate, FileAccess.Write, FileShare.Read, bytes.Length);
                dsm.Seek(0, SeekOrigin.Begin);
                dsm.Write(bytes);
                dsm.Flush();

                committedHeader = pendingHeader.Value;

                pendingHeader = null;
            }
        }


        byte[] StructureToByteArray<T>(T obj)
        {
            int len = Marshal.SizeOf(obj);
            byte[] arr = new byte[len];

            IntPtr ptr = Marshal.AllocHGlobal(len);
            Marshal.StructureToPtr(obj, ptr, true);
            Marshal.Copy(ptr, arr, 0, len);
            Marshal.FreeHGlobal(ptr);
            return arr;
        }
    }
}
