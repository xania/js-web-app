using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Api.Data
{
    public class QueryTranslator<T> : IQueryable<T>
    {
        public QueryTranslator(IQueryable inner)
        {
            Inner = inner;
            Provider = new QueryTranslatorProvider<T>(inner.Provider);
            ElementType = inner.ElementType;
            Expression = inner.Expression;
        }

        public Type ElementType { get; }

        public Expression Expression { get; }

        public IQueryProvider Provider { get; }

        public IQueryable Inner { get; }

        public IEnumerator<T> GetEnumerator()
        {
            var expression = ExpandInvokeVisitor.VisitAndConvert(Expression);

            return Inner.Provider.CreateQuery<T>(expression).GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        private class ExpandInvokeVisitor : ExpressionVisitor
        {
            public static readonly ExpandInvokeVisitor Instance = new ExpandInvokeVisitor();
            public static Expression VisitAndConvert(Expression root)
            {
                return Instance.Visit(root);
            }

            protected override Expression VisitMethodCall(MethodCallExpression node)
            {
                var methodName = node.Method.Name;
                if (node.Object != null || node.Arguments.Count == 0 || !methodName.Equals("Apply"))
                    return base.VisitMethodCall(node);

                if (typeof(LambdaExpression).IsAssignableFrom(node.Arguments[0].Type))
                {
                    var lambdaExpression = Expand(node.Arguments[0]);
                    var body = lambdaExpression.Body;
                    var parameters = lambdaExpression.Parameters;
                    return Visit(new ParameterReplacerVisitor(parameters, node.Arguments.Skip(1).ToArray()).VisitAndConvert(body));
                }
                return base.VisitMethodCall(node);
            }

            public static LambdaExpression Expand(Expression expr)
            {
                return Expression.Lambda<Func<LambdaExpression>>(expr).Compile()();
            }
        }

        private class ParameterReplacerVisitor : ExpressionVisitor
        {
            private readonly IDictionary<ParameterExpression, Expression> map;

            public ParameterReplacerVisitor
                    (IReadOnlyList<ParameterExpression> sources, IReadOnlyList<Expression> targets)
            {
                map = new Dictionary<ParameterExpression, Expression>();
                foreach(var pair in sources.Zip(targets, (s, t) => new KeyValuePair<ParameterExpression, Expression>(s, t)))
                {
                    map.Add(pair);
                }
            }

            internal Expression VisitAndConvert(Expression root)
            {
                return Visit(root);
            }

            protected override Expression VisitLambda<U>(Expression<U> node)
            {
                var parameters = node.Parameters.Where(p => !map.ContainsKey(p));
                return Expression.Lambda(Visit(node.Body), parameters);
            }

            protected override Expression VisitParameter(ParameterExpression node)
            {
                if (map.TryGetValue(node, out var target))
                {
                    return target;
                }
                return node;
            }
        }
    }
}
