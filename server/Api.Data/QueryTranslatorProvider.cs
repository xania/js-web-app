using System;
using System.Linq;
using System.Linq.Expressions;

namespace Api.Data
{

    internal class QueryTranslatorProvider<T> : IQueryProvider
    {
        private readonly IQueryProvider inner;

        public QueryTranslatorProvider(IQueryProvider provider)
        {
            this.inner = provider;
        }

        public IQueryable CreateQuery(Expression expression)
        {
            var inner = this.inner.CreateQuery(expression);
            return (IQueryable)Activator.CreateInstance(typeof(QueryTranslator<>).MakeGenericType(inner.ElementType), new object[] { inner });
        }

        public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
        {
            var inner = this.inner.CreateQuery<TElement>(expression);
            return new QueryTranslator<TElement>(inner);
        }

        public object Execute(Expression expression)
        {
            return inner.Execute(expression);
        }

        public TResult Execute<TResult>(Expression expression)
        {
            return inner.Execute<TResult>(expression);
        }
    }
}
