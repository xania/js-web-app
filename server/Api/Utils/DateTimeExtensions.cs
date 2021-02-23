using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Api.Utils
{
    public static class DateTimeExtensions
    {
        public static DateTimeOffset Ceiling(this DateTimeOffset dateTimeOffset)
        {
            return dateTimeOffset.Ceiling(TimeSpan.FromMinutes(1));
        }

        public static DateTimeOffset Ceiling(this DateTimeOffset dateTimeOffset, TimeSpan interval)
        {
            var overflow = dateTimeOffset.Ticks % interval.Ticks;

            return overflow == 0 ? dateTimeOffset : dateTimeOffset.AddTicks(interval.Ticks - overflow);
        }

        public static DateTimeOffset Max(this DateTimeOffset x, DateTimeOffset y)
        {
            return x > y ? x : y;
        }
        
        public static DateTimeOffset Min(this DateTimeOffset x, DateTimeOffset y)
        {
            return x < y ? x : y;
        }
    }

    public static class JsonOptionsExtensions
    {
        public static JsonSerializerOptions Copy(this JsonSerializerOptions options)
        {
            var result =  new JsonSerializerOptions
            {
                AllowTrailingCommas = options.AllowTrailingCommas,
                DefaultBufferSize = options.DefaultBufferSize,
                DictionaryKeyPolicy = options.DictionaryKeyPolicy,
                Encoder = options.Encoder,
                IgnoreNullValues = options.IgnoreNullValues,
                IgnoreReadOnlyProperties = options.IgnoreReadOnlyProperties,
                MaxDepth = options.MaxDepth,
                PropertyNameCaseInsensitive = options.PropertyNameCaseInsensitive,
                PropertyNamingPolicy = options.PropertyNamingPolicy,
                ReadCommentHandling = options.ReadCommentHandling,
                WriteIndented = options.WriteIndented
            };

            foreach(var c in options.Converters)
            {
                result.Converters.Add(c);
            }

            return result;
        }

        public static JsonSerializerOptions Add(this JsonSerializerOptions options, JsonConverter converter)
        {
            options.Converters.Add(converter);

            return options;
        }
    }
}
