using System;
using System.Collections.Generic;
using System.Text;

namespace Api.Domain.Interfaces
{
    public interface ITimeLineOwner
    {
        TimeLine TimeLine { get; }
    }
}
