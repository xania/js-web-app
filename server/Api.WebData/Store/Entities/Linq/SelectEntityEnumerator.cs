using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public class SelectEntityEnumerator<T, U> : ITryEnumerator<U>
    {
        private IEntityEnumerator<T> enumerator;
        private EntityFunc<T, U> selector;

        public SelectEntityEnumerator(IEntityEnumerator<T> enumerator, EntityFunc<T, U> selector)
        {
            this.enumerator = enumerator;
            this.selector = selector;
        }

        public void Dispose()
        {
            this.enumerator?.Dispose();
        }

        public U Current => this.selector(this.enumerator.Current);

        public bool TryMoveNext()
        {
            return this.enumerator.TryMoveNext(null);
        }
    }
}
