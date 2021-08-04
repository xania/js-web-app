using System.Runtime.InteropServices;

namespace Api.WebData.Store.Records
{
    [StructLayout(LayoutKind.Sequential)]
    public readonly struct RecordHandle
    {
#if WIN32
        public readonly int Handle;
#else
        public readonly long Value;
#endif
        unsafe internal RecordHandle(Record* record)
        {
#if WIN32
            Value = (int)record;
#else
            Value = (long)record;
#endif
        }

        public unsafe Record* Record => (Record*)Value;
    }
}
