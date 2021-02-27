using System;

namespace Api.Domain
{
    public class Demand
    {
        public Guid Id { get; set; }
        public string Value { get; set; }
        public DateTimeOffset Day { get; set; }
        public Guid PositionId { get; set; }

        public Position Position { get; set; }
        public Maintenance Maintenance { get; set; }
    }
}
