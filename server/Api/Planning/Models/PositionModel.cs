using System;
using System.Collections.Generic;

namespace Api.Planning.Controllers
{
    public class PositionModel
    {
        public Guid Id { get; set; }
        public IEnumerable<PositionModel> Children { get; set; }
        public string Name { get; set; }
    }
}
