using System;
using System.Collections.Generic;

namespace Api.Domain
{
    public class Position
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Shorthand { get; set; }
        public Guid? ParentId { get; set; }
        public string DefaultColor { get; set; }

        public Maintenance Maintenance { get; set;  }

        public ICollection<Demand> Demands { get; set; }
    }
}
