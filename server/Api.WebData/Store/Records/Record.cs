using System.Runtime.InteropServices;

namespace Api.WebData.Store.Records
{
    [StructLayout(LayoutKind.Sequential, Size = sizeof(short))]
    public readonly ref struct Record
    {
        public readonly short Length;
    }
}
