using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Planning.Models
{
    public class TrackModel
    {
        public Guid Id { get; set; }
        public string TrackId { get; set; }
        public Guid TrackGuid { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public EmployeeModel Employee { get; set; }
        public string GroupingTrackId { get; set; }
        public Guid PositionId { get; set; }
    }
}
