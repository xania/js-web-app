using Api.Utils;
using System;

namespace Api.Planning.Controllers
{
    public class PositionSupplyModel
    {
        public Guid PositionId { get; internal set; }
        public Guid EmployeeId { get; internal set; }
        public TimeTableCell Start { get; internal set; }
        public TimeTableCell End { get; internal set; }
    }
}
