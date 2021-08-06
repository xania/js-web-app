using System;
using System.Linq.Expressions;

namespace Api.Data.Linq
{
    public static class QueryTranslatorExtensions
    {
        public static T Apply<T>(this Expression<Func<T>> expr)
        {
            return expr.Compile().Invoke();
        }

        public static T Apply<U1, T>(this Expression<Func<U1, T>> expr, U1 arg1)
        {
            return expr.Compile().Invoke(arg1);
        }

        public static T Apply<T, U1, U2>(this Expression<Func<U1, U2, T>> expr, U1 arg1, U2 arg2)
        {
            return expr.Compile().Invoke(arg1, arg2);
        }
    }
}
