using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Domain
{
    [ComplexType]
    public class TimeLine
    {
        [Column("StartTime")]
        public DateTimeOffset StartTime { get; set; }

        [Column("EndTime")]
        public DateTimeOffset EndTime { get; set; }
    }
}
