using System;

namespace Api.Domain
{
    public class Employee
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public LifeTime LifeTime { get; set; }
    }
}
