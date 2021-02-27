using System;

namespace Api.Domain
{
    public class Plan
    {
        public Guid Id { get; set; }

        public TimeLine TimeLine { get; set; }
        public Guid? EmployeeId { get; set; }
        public Guid? SubstituteEmployeeId { get; set; }
        public Guid PositionId { get; set; }
        public Maintenance Maintenance { get; set; }

        public Position Position { get; set; }
        public string TrackId { get; set; }
        public Guid? TrackGuid { get; set; }
        public string GroupingTrackId { get; set; }

        public Employee Employee { get; set; }
    }
}
