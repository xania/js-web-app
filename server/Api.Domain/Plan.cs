using System;

namespace Api.Domain
{
    public class Plan
    {
        public Guid Id { get; set; }

        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get;  set; }

        public Guid? EmployeeId { get; set; }
        public Guid? SubstituteEmployeeId { get; set; }
        public Guid PositionId { get; set; }
        public LifeTime LifeTime { get; set; }

        public Position Position { get; set; }
        public string TrackId { get; set; }
        public Guid? TrackGuid { get; set; }
        public string GroupingTrackId { get; set; }

        public Employee Employee { get; set; }
    }

    public class Employee
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public LifeTime LifeTime { get; set; }
    }
}
