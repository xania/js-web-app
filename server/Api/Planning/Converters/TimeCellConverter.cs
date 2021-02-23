using System;
using System.Text.Json;

namespace Api.Planning.Converters
{
    public class TimeCellConverter : System.Text.Json.Serialization.JsonConverter<DateTimeOffset>
    {
        private DateTimeOffset anchor;

        public TimeCellConverter(DateTimeOffset start)
        {
            this.anchor = start;
        }

        public override DateTimeOffset Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var minutes = reader.GetDouble();
            return anchor + TimeSpan.FromMinutes(minutes);
        }

        public override void Write(Utf8JsonWriter writer, DateTimeOffset value, JsonSerializerOptions options)
        {
            var diff = value - anchor;
            writer.WriteNumberValue(diff.TotalMinutes);
        }
    }
}
