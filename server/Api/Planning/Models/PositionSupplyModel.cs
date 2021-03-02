using System;

namespace Api.Planning.Models
{
    public class PositionSupplyModel
    {
        public Guid PositionId { get; internal set; }
        public Guid? EmployeeId { get; internal set; }
        public DateTimeOffset StartTime { get; internal set; }
        public DateTimeOffset EndTime { get; internal set; }
    }
}
