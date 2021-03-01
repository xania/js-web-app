using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Utils
{
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
