using Api.WebData.Store.Records;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public class OrderEntityByEnumerator<T, K> : IEntityEnumerator<T>
    {
        private readonly IEnumerator<(K key, RecordHandle handle)> ordered;

        public OrderEntityByEnumerator(IEntityEnumerator<T> enumerator, EntityFunc<T, K> keySelector, bool descending = false)
        {
            var items = Items(enumerator, keySelector);
            this.ordered = (
                descending ? items.OrderByDescending(e => e.key) : items.OrderBy(e => e.key)
            ).GetEnumerator();
        }

        public void Dispose()
        {
            this.ordered?.Dispose();
        }

        private IEntity<T> _current = null;
        public IEntity<T> Current => _current ?? (_current = CreateEntity());

        private unsafe IEntity<T> CreateEntity() => new Entity<T>(ordered.Current.handle.Record);

        public unsafe bool TryMoveNext(EntityFunc<T, bool> predicate)
        {
            _current = null;
            if (predicate == null)
            {
                if (ordered.MoveNext())
                {
                    return true;
                }
                return false;
            }

            while (ordered.MoveNext())
            {
                if (predicate(_current = CreateEntity()))
                    return true;
            }

            return false;
        }

        private IEnumerable<(K key, RecordHandle)> Items(IEntityEnumerator<T> enumerator, EntityFunc<T, K> keySelector)
        {
            while (enumerator.TryMoveNext(null))
            {
                var entity = enumerator.Current;
                var key = keySelector(entity);
                yield return (key, entity.Handle);
            }
        }
    }
}
