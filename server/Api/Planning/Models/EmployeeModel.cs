using Api.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Planning.Models
{
    public class EmployeeModel
    {
        public Guid? Id { get; internal set; }
        public string FirstName { get; internal set; }
        public string LastName { get; internal set; }
        public IEnumerable<ShiftModel> Shifts { get; set; }
    }

    public class ShiftModel
    {
        public TimeLine TimeLine { get; internal set; }
        public string Name { get; internal set; }
        public Guid Id { get; internal set; }
    }
}
