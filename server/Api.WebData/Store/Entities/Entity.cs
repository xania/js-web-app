using Api.WebData.Store.Records;
using System;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text.Json;

namespace Api.WebData.Store.Entities
{
    public static class Entity
    {
        public const int SizeOfId = 16;
        public const int ContentOffset = SizeOfId + sizeof(long);
        public static readonly byte[] NULL = { (byte)'n', (byte)'u', (byte)'l', (byte)'l' };

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe Guid GetId(Record* record)
        {
            var memory = ((byte*)record - record->Length);
            return *(Guid*)memory;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe Guid GetId(byte* memory)
        {
            // var memory = ((byte*)record - record->Length);
            return *(Guid*)memory;
        }
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe Guid GetId(in Span<byte> record)
        {
            fixed (byte* b = record)
            {
                return Unsafe.ReadUnaligned<Guid>(b);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static Guid GetId(in Memory<byte> record)
        {
            return MemoryMarshal.Read<Guid>(record.Span);
        }
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe long GetVersion(in Span<byte> record)
        {
            return Unsafe.ReadUnaligned<long>(ref record[16]);
        }
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe long GetVersion(Record* record)
        {
            var memory = (byte*)record;
            var version = Unsafe.ReadUnaligned<long>(memory - record->Length + 16);
            return Math.Abs(version);
        }
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe long GetVersion(byte* record)
        {
            return *(long*)(record + 16);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe JsonElement GetContent(byte* record, int length)
        {
            return JsonSerializer.Deserialize<JsonElement>(new ReadOnlySpan<byte>(record + ContentOffset, length - ContentOffset));
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe JsonElement GetContent(Record* record)
        {
            var contentLength = record->Length - ContentOffset;
            var memory = ((byte*)record) - contentLength;
            return JsonSerializer.Deserialize<JsonElement>(new ReadOnlySpan<byte>(memory, contentLength));
        }


        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe T GetContent<T>(Record* record)
        {
            var contentLength = record->Length - ContentOffset;
            var memory = ((byte*)record) - contentLength;
            return JsonSerializer.Deserialize<T>(new ReadOnlySpan<byte>(memory, contentLength));
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static JsonElement GetContent(in ReadOnlySpan<byte> content)
        {
            return JsonSerializer.Deserialize<JsonElement>(content);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static unsafe T GetContent<T>(ReadOnlySpan<byte> content)
        {
            return JsonSerializer.Deserialize<T>(content, JsonSerializerOptions);
        }

        static readonly JsonSerializerOptions JsonSerializerOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        private const byte Quote = (byte)'"';
        public unsafe static bool Contains<T>(Record* record, byte[] utf8Text)
        {
            var valueLength = utf8Text.Length;
            if (valueLength == 0)
                return true;

            var contentLength = record->Length - ContentOffset;
            if (contentLength < valueLength)
                return false;

            var memory = ((byte*)record) - contentLength;
            ref var tailRef = ref utf8Text[1];
            var head = utf8Text[0];

            var remainingLength = contentLength - valueLength;

            for (var i = 0; i < remainingLength; i++)
            {
                if (memory[i] == Quote)
                {
                    while (++i < remainingLength)
                    {
                        var c = memory[i];
                        if (c == Quote)
                            break;
                        if (c == head)
                        {
                            if (valueLength == 1)
                                return true;
                            ref var stringRef = ref memory[i + 1];
                            if (RecordHelpers.SequenceEqual(ref stringRef, ref tailRef, valueLength - 1))
                                return true;
                        }
                    }
                }
            }
            return false;
        }

    }


}
