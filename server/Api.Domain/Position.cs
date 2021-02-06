using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain
{
    public class Position
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public LifeTime LifeTime { get; set;  }

        public ICollection<Demand> Demands { get; set; }
    }

    [ComplexType]
    public class LifeTime
    {
        [Column("CreatedAt")]
        public DateTimeOffset CreatedAt { get; set; }
        [Column("UpdatedAt")]
        public DateTimeOffset UpdatedAt { get; set; }
        [Column("DeletedAt")]
        public DateTimeOffset? DeletedAt { get; set; }
    }

    public class Demand
    {
        public Guid Id { get; set; }
        public string Value { get; set; }
        public DateTime Day { get; set; }
        public LifeTime LifeTime { get; set; }
        public Guid PositionId { get; set; }

        public Position Position { get; set; }
    }
}
