using Api.Domain.Interfaces;
using System;

namespace Api.Domain
{
    public class Shift: ITimeLineOwner
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public TimeLine TimeLine { get; set; }
        public Maintenance Maintenance { get; set; }
        public string Name { get; set; }
    }
}
