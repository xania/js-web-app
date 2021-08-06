using System;
using System.Collections.Generic;

namespace Api.Planning.Models
{
    public class PositionModel
    {
        public Guid Id { get; set; }
        public IEnumerable<PositionModel> Children { get; set; }
        public string Name { get; set; }
        public string Shorthand { get; internal set; }
        public string DefaultColor { get; internal set; }
    }
}
