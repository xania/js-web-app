using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Utils
{
    public static class DateTimeExtensions
    {
        public static DateTimeOffset Ceiling(this DateTimeOffset dateTimeOffset)
        {
            return dateTimeOffset.Ceiling(TimeSpan.FromMinutes(1));
        }

        public static DateTimeOffset Ceiling(this DateTimeOffset dateTimeOffset, TimeSpan interval)
        {
            var overflow = dateTimeOffset.Ticks % interval.Ticks;

            return overflow == 0 ? dateTimeOffset : dateTimeOffset.AddTicks(interval.Ticks - overflow);
        }

        public static DateTimeOffset Max(this DateTimeOffset x, DateTimeOffset y)
        {
            return x > y ? x : y;
        }
        
        public static DateTimeOffset Min(this DateTimeOffset x, DateTimeOffset y)
        {
            return x < y ? x : y;
        }
    }
}
