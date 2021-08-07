using System.Text;

namespace Api.WebData.Store.Entities.Linq
{
    public class JoinEntityEnumerator<TOuter, TInner, TKey, TResult> : ITryEnumerator<TResult>
    {
        private IEntityEnumerator<TOuter> outer;
        private IEntityEnumerator<TInner> inner;
        private EntityFunc<TOuter, TKey> outerKeySelector;
        private EntityFunc<TOuter, TInner, TResult> resultSelector;
        private EntityIndex<TInner, TKey> innerIndex;

        public JoinEntityEnumerator(IEntityEnumerator<TOuter> outer, IEntityEnumerator<TInner> inner, EntityFunc<TOuter, TKey> outerKeySelector, EntityFunc<TInner, TKey> innerKeySelector, EntityFunc<TOuter, TInner, TResult> resultSelector)
        {
            this.outer = outer;
            this.inner = inner;
            this.outerKeySelector = outerKeySelector;
            this.resultSelector = resultSelector;

            this.innerIndex = new EntityIndex<TInner, TKey>(inner, innerKeySelector);
        }

        public void Dispose()
        {
            this.inner?.Dispose();
            this.outer?.Dispose();
        }

        public TResult Current { get; private set; }

        public bool TryMoveNext()
        {
            while (outer.TryMoveNext(null))
            {
                var outerItem = outer.Current;
                var outerKey = this.outerKeySelector(outerItem);

                if (innerIndex.TryGetValue(outerKey, out var innerItem))
                {
                    Current = resultSelector(outerItem, innerItem);
                    return true;
                }
            }
            return false;
        }
    }

}
