using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public interface ITryEnumerator<T> : IDisposable
    {
        bool TryMoveNext();
        T Current { get; }
    }

}
