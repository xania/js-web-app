using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public class TakeEntityEnumerator<T> : IEntityEnumerator<T>
    {
        private IEntityEnumerator<T> enumerator;
        private int count;

        public TakeEntityEnumerator(IEntityEnumerator<T> enumerator, int count)
        {
            this.enumerator = enumerator;
            this.count = count;
        }

        public void Dispose()
        {
            this.enumerator?.Dispose();
        }

        public IEntity<T> Current => enumerator.Current;

        public bool TryMoveNext(EntityFunc<T, bool> predicate)
        {
            if (count <= 0)
            {
                return false;
            }
            if (this.enumerator.TryMoveNext(predicate))
            {
                count--;
                return true;
            }
            count = 0;
            return false;
        }
    }
}
