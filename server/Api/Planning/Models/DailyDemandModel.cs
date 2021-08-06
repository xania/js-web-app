using System;
using System.Collections.Generic;
using System.Linq;

namespace Api.Planning.Models
{
    public class DailyDemandModel
    {
        public Guid PositionId { get; set; }
        public IEnumerable<int> Values { get; private set; }
        public static DailyDemandModel Create(Guid positionId, IEnumerable<string> input)
        {
            return new DailyDemandModel
            {
                PositionId = positionId,
                Values = Merge(input.Select(Parse))
            };

            static IEnumerable<int> Parse(string values)
            {
                return values.Split(",").Select(e => int.TryParse(e, out var x) ? x : 0);
            }
        }

        private static IEnumerable<int> Merge(IEnumerable<IEnumerable<int>> enumerable)
        {
            var result = new int[24 * 12];
            var sources = enumerable.Select(x => x.ToArray());
            for (int i = 0; i < result.Length; i++)
            {
                result[i] = sources.Select(x => GetValue(x, i)).Sum();
            }
            return result;

            int GetValue(int[] source, int idx)
            {
                var i = (idx * source.Length) / result.Length;
                return source[i];
            }
        }
    }
}
