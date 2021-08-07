using Api.WebData.Store.Entities.Linq;
using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store.Entities
{
    public static class EntitySetExtensions
    {
        public static SelectEntityEnumerator<T, U> Select<T, U>(this IEntitySet<T> set, EntityFunc<T, U> predicate)
        {
            return new SelectEntityEnumerator<T, U>(set.EnumeratorEntities(), predicate);
        }

        public static IEntityEnumerator<U> Cast<T, U>(this IEntitySet<T> set)
        {
            return new CastEntityEnumerator<T, U>(set.EnumeratorEntities());
        }

        public static IEntityEnumerator<U> Cast<T, U>(this IEntityEnumerator<T> enumerator)
        {
            return new CastEntityEnumerator<T, U>(enumerator);
        }

        public static WhereEntityEnumerator<T> Where<T>(this IEntitySet<T> set, EntityFunc<T, bool> predicate)
        {
            return new WhereEntityEnumerator<T>(set.EnumeratorEntities(), predicate);
        }

        public static SelectEntityEnumerator<T, U> Select<T, U>(this IEntityEnumerator<T> enumerator, EntityFunc<T, U> predicate)
        {
            return new SelectEntityEnumerator<T, U>(enumerator, predicate);
        }

        public static TakeEntityEnumerator<T> Take<T>(this IEntityEnumerator<T> enumerator, int count)
        {
            return new TakeEntityEnumerator<T>(enumerator, count);
        }

        public static OrderByEnumerator<T, P> OrderBy<T, P>(this ITryEnumerator<T> enumerator, Func<T, P> propertySelector)
        {
            return new OrderByEnumerator<T, P>(enumerator, propertySelector, false);
        }

        public static OrderByEnumerator<T, P> OrderByDescending<T, P>(this ITryEnumerator<T> enumerator, Func<T, P> propertySelector)
        {
            return new OrderByEnumerator<T, P>(enumerator, propertySelector, true);
        }

        public static OrderEntityByEnumerator<T, P> OrderBy<T, P>(this IEntityEnumerator<T> enumerator, EntityFunc<T, P> propertySelector)
        {
            return new OrderEntityByEnumerator<T, P>(enumerator, propertySelector, false);
        }

        public static OrderEntityByEnumerator<T, P> OrderByDescending<T, P>(this IEntityEnumerator<T> enumerator, EntityFunc<T, P> propertySelector)
        {
            return new OrderEntityByEnumerator<T, P>(enumerator, propertySelector, true);
        }

        public static WhereEntityEnumerator<T> Where<T>(this IEntityEnumerator<T> enumerator, EntityFunc<T, bool> predicate)
        {
            return new WhereEntityEnumerator<T>(enumerator, predicate);
        }

        //public static DistinctEntityEnumerator<T> Distinct<T>(this IEntityEnumerator<T> enumerator, int maxCount)
        //{
        //    return new DistinctEntityEnumerator<T>(enumerator, maxCount);
        //}


        public static JoinEntityEnumerator<TOuter, TInner, TKey, TResult> Join<TOuter, TInner, TKey, TResult>(
            this IEntityEnumerator<TOuter> outer,
            IEntitySet<TInner> inner,
            EntityFunc<TOuter, TKey> outerKeySelector,
            EntityFunc<TInner, TKey> innerKeySelector,
            EntityFunc<TOuter, TInner, TResult> resultSelector)
        {
            return new JoinEntityEnumerator<TOuter, TInner, TKey, TResult>(
                outer,
                inner.EnumeratorEntities(),
                outerKeySelector,
                innerKeySelector,
                resultSelector
            );
        }

        public static JoinEntityEnumerator<TOuter, TInner, TKey, TResult> Join<TOuter, TInner, TKey, TResult>(
            this IEntityEnumerator<TOuter> outer,
            IEntityEnumerator<TInner> inner,
            EntityFunc<TOuter, TKey> outerKeySelector,
            EntityFunc<TInner, TKey> innerKeySelector,
            EntityFunc<TOuter, TInner, TResult> resultSelector)
        {
            return new JoinEntityEnumerator<TOuter, TInner, TKey, TResult>(
                outer,
                inner,
                outerKeySelector,
                innerKeySelector,
                resultSelector
            );
        }

        public static JoinEntityEnumerator<TOuter, TInner, TKey, TResult> Join<TOuter, TInner, TKey, TResult>(
            this IEntitySet<TOuter> outer,
            IEntityEnumerator<TInner> inner,
            EntityFunc<TOuter, TKey> outerKeySelector,
            EntityFunc<TInner, TKey> innerKeySelector,
            EntityFunc<TOuter, TInner, TResult> resultSelector)
        {
            return new JoinEntityEnumerator<TOuter, TInner, TKey, TResult>(
                outer.EnumeratorEntities(),
                inner,
                outerKeySelector,
                innerKeySelector,
                resultSelector
            );
        }

        public static T FirstOrDefault<T>(this ITryEnumerator<T> enumerator)
        {
            try
            {
                if (enumerator.TryMoveNext())
                    return enumerator.Current;
                return default;
            }
            finally
            {
                enumerator.Dispose();
            }
        }

        public static IEntity<T> FirstOrDefault<T>(this IEntityEnumerator<T> enumerator)
        {
            try
            {
                if (enumerator.TryMoveNext(null))
                    return enumerator.Current;
                return default;
            }
            finally
            {
                enumerator.Dispose();
            }
        }


        public static T LastOrDefault<T>(this ITryEnumerator<T> enumerator)
        {
            try
            {
                while (enumerator.TryMoveNext()) ;
                return enumerator.Current;
            }
            finally
            {
                enumerator.Dispose();
            }
        }

        public static IEntity<T> FirstOrDefault<T>(this EntitySet<T> entitySet, EntityFunc<T, bool> predicate)
        {
            using var enumerator = entitySet.EnumeratorEntities();
            return enumerator.FirstOrDefault(predicate);
        }

        public static IEntity<T> FirstOrDefault<T>(this IEntityEnumerator<T> enumerator, EntityFunc<T, bool> predicate)
        {
            try
            {
                if (enumerator.TryMoveNext(predicate))
                    return enumerator.Current;

                return default;
            }
            finally
            {
                enumerator.Dispose();
            }
        }

        public static T[] ToArray<T>(this ITryEnumerator<T> enumerator)
        {
            try
            {
                var list = new List<T>();
                while (enumerator.TryMoveNext())
                    list.Add(enumerator.Current);
                return list.ToArray();
            }
            finally
            {
                enumerator.Dispose();
            }
        }

        public static IEnumerable<T> AsEnumerable<T>(this ITryEnumerator<T> enumerator)
        {
            try
            {
                while (enumerator.TryMoveNext())
                    yield return enumerator.Current;
            }
            finally
            {
                enumerator?.Dispose();
            }
        }

        //public static SearchEntityEnumerator<T> Search<T>(this IEntityEnumerator<T> enumerator, string term)
        //{
        //    return new SearchEntityEnumerator<T>(enumerator, term);
        //}
    }
}
