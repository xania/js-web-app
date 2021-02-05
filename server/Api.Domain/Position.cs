using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain
{
    public class Position
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public LifeTime LifeTime { get; set;  }
    }

    [ComplexType]
    public class LifeTime
    {
        //public DateTimeOffset? CreatedAt { get; set; }
        //public DateTimeOffset? UpdatedAt { get; set; }
        [Column("DeletedAt")]
        public DateTimeOffset? DeletedAt { get; set; }
    }
}
