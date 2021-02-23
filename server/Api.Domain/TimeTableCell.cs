using System;

namespace Api.Domain
{
    public class TimeTableCell
    {
        public int Hour { get; set; }
        public int Minute { get; set; }

        public TimeTableCell(TimeSpan ts)
        {
            Hour = ts.Hours;
            Minute = ts.Minutes;
        }
    }
}
