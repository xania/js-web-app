using System;

namespace Api.Utils
{
    public class TimeTableCell 
    {
        public int Hour { get; set; }
        public int Minute { get; set; }

        public static implicit operator TimeTableCell(TimeSpan ts)
        {
            return new TimeTableCell
            {
                Hour = ts.Hours,
                Minute = ts.Minutes,
            };
        }
    }
}
