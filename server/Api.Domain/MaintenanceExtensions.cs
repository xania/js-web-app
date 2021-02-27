using Api.Domain.Interfaces;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Api.Domain
{
    public static class MaintenanceExtensions
    {
        private static Expression<Func<TimeLine, bool>> IsInRangeExpr(DateTimeOffset startTime, DateTimeOffset endTime) =>
            t => t.StartTime < endTime && t.EndTime > startTime;
        private static readonly Expression<Func<Maintenance, bool>> isNotDeletedExpr = m => m.DeletedAt == null;

        public static IQueryable<T> IsActiveInRange2<T>(this IQueryable<T> source, DateTimeOffset startTime, DateTimeOffset endTime)
            where T: ITimeLineOwner
        {
            var sourceParamExpr = Expression.Parameter(typeof(T));

            var maintenanceExpr = Expression.Property(sourceParamExpr, "Maintenance");
            var notDeletedExpr = isNotDeletedExpr.RelaceParameter(maintenanceExpr).Body;

            var timeLineExpr = Expression.Property(sourceParamExpr, "TimeLine");
            var inRangeExpr = IsInRangeExpr(startTime, endTime).RelaceParameter(timeLineExpr).Body;

            var andExpr = Expression.And(notDeletedExpr, inRangeExpr);
            return source.Where(
                Expression.Lambda<Func<T, bool>>(andExpr, sourceParamExpr)
            );
        }
    }
}
