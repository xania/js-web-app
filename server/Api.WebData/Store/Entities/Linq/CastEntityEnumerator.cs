using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public class CastEntityEnumerator<T, U> : IEntityEnumerator<U>
    {
        private IEntityEnumerator<T> inner;
        public CastEntityEnumerator(IEntityEnumerator<T> inner)
        {
            this.inner = inner;
        }

        public IEntity<U> Current => inner.Current.Cast<U>();

        public void Dispose()
        {
            this.inner.Dispose();
        }

        public bool TryMoveNext(EntityFunc<U, bool> predicate)
        {
            return this.inner.TryMoveNext(e => predicate(e.Cast<U>()));
        }
    }
}
