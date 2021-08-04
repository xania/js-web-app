using System.Runtime.InteropServices;

namespace Api.WebData.Store
{
    [StructLayout(LayoutKind.Sequential)]
    public struct Header
    {
        public int Version;
        public int Count;
        public int Length;
    }
}