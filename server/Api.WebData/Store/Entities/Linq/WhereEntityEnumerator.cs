using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public class WhereEntityEnumerator<T> : IEntityEnumerator<T>
    {
        private IEntityEnumerator<T> enumerator;
        private EntityFunc<T, bool> predicate;

        public WhereEntityEnumerator(IEntityEnumerator<T> enumerator, EntityFunc<T, bool> predicate)
        {
            this.enumerator = enumerator;
            this.predicate = predicate;
        }
        public void Dispose()
        {
            this.enumerator?.Dispose();
        }

        public IEntity<T> Current => enumerator.Current;

        public bool TryMoveNext(EntityFunc<T, bool> predicate)
        {
            if (predicate == null)
                return enumerator.TryMoveNext(this.predicate);

            return enumerator.TryMoveNext(Filter);
            bool Filter(IEntity<T> e)
            {
                return predicate(e) && this.predicate(e);
            }
        }
    }
}
