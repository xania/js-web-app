using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain
{
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
}
