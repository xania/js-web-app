using System;

namespace Api.Domain
{
    public class Plan
    {
        public Guid Id { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public Guid? EmployeeId { get; set; }
        public Guid? SubstituteEmployeeId { get; set; }
        public Guid PositionId { get; set; }
        public LifeTime LifeTime { get; set; }

        public Position Position { get; set; }
    }
}
