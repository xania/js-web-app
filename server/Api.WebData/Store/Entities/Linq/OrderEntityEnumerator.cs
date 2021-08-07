using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public class OrderByEnumerator<T, P> : ITryEnumerator<T>
    {
        private IEnumerator<T> ordered;

        public OrderByEnumerator(ITryEnumerator<T> enumerator, Func<T, P> propertySelector, bool descending = false)
        {
            var items = Items(enumerator);
            this.ordered = (
                descending ? items.OrderByDescending(propertySelector) : items.OrderBy(propertySelector)
            ).GetEnumerator();
        }

        public void Dispose()
        {
            this.ordered?.Dispose();
        }

        public T Current => ordered.Current;

        public bool TryMoveNext()
        {
            return ordered.MoveNext();
        }

        private static IEnumerable<T> Items(ITryEnumerator<T> enumerator)
        {
            while (enumerator.TryMoveNext())
                yield return enumerator.Current;
        }
    }
}
