using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Api.Domain
{
    public static class LambdaExtensions
    {
        public static LambdaExpression RelaceParameter<T>(this Expression<T> expr, Expression target)
        {
            return Replace<T>(expr, expr.Parameters[0], target);
        }
        // Produces an expression identical to 'expression'
        // except with 'source' parameter replaced with 'target' expression.     
        public static LambdaExpression Replace<T>(Expression<T> expression, ParameterExpression source, Expression target)
        {
            return new ParameterReplacerVisitor(source, target).VisitAndConvert<T>(expression);
        }

        private class ParameterReplacerVisitor : ExpressionVisitor
        {
            private readonly ParameterExpression _source;
            private readonly Expression _target;

            public ParameterReplacerVisitor
                    (ParameterExpression source, Expression target)
            {
                _source = source;
                _target = target;
            }

            internal LambdaExpression VisitAndConvert<T>(Expression<T> root)
            {
                // Leave all parameters alone except the one we want to replace.
                var parameters = root.Parameters
                                     .Where(p => p != _source);

                return Expression.Lambda(Visit(root.Body), parameters);
            }

            protected override Expression VisitParameter(ParameterExpression node)
            {
                // Replace the source with the target, visit other params as usual.
                return node == _source ? _target : base.VisitParameter(node);
            }
        }
    }
}
