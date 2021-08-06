using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Domain
{
    public class PlanDetail
    {
        public Guid Id { get; set; }
        public ICollection<string> Remark { get; set; }
        public ICollection<string> SendRemark { get; set; }
        public ICollection<string> Highlight { get; set; }
        public Guid EemployeeId { get; set; }
        public DateTimeOffset Date { get; set; }

        public Maintenance Maintenance { get; set; }
    }
}
