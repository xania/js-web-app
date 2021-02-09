using Api.Domain;
using Api.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlanningController : ControllerBase
    {
        private readonly RomDbContext db;

        public PlanningController(RomDbContext db)
        {
            this.db = db;
        }

        [HttpGet("position-supply")]
        public IEnumerable<PositionSupplyVM> GetPositionSupply()
        {
            var start = new DateTimeOffset(2021, 01, 14, 0, 0, 0, TimeZoneInfo.Local.BaseUtcOffset);
            var end = start + TimeSpan.FromDays(1);

            var entries =
                from p in db.Plan
                where p.StartTime < end &&
                    p.EndTime > start &&
                    p.EmployeeId.HasValue &&
                    p.LifeTime.DeletedAt == null &&
                    p.Position.LifeTime.DeletedAt == null
                let pos = p.Position
                select new
                {
                    PositionId = pos.Id,
                    EmployeeId = p.EmployeeId.Value,
                    p.StartTime,
                    p.EndTime
                };


            var max = end - start;
            return
                from entry in entries.AsEnumerable()
                select new PositionSupplyVM
                {
                    PositionId = entry.PositionId,
                    EmployeeId = entry.EmployeeId,
                    Start = entry.StartTime.Max(start) - start,
                    End = entry.EndTime.Ceiling().Min(end) - start
                };
        }

        [HttpGet("positions")]
        public IEnumerable<PositionVM> GetPositions()
        {
            var active =
                from p in this.db.Positions
                where p.LifeTime.DeletedAt == null
                select new
                {
                    p.Id,
                    p.ParentId,
                    p.Name
                };

            var childrenLookup = active.ToLookup(e => e.ParentId);

            return ToTree(null);
            IEnumerable<PositionVM> ToTree(Guid? parentId)
            {
                foreach (var pos in childrenLookup[parentId].OrderBy(e => e.Name))
                {
                    var vm = new PositionVM
                    {
                        Id = pos.Id,
                        Name = pos.Name,
                        Children = ToTree(pos.Id)
                    };
                    yield return vm;
                }
            }
        }

        private static DateTimeOffset ToServerTimeZone(DateTime dateTime)
        {
            var timeZone = TimeZoneInfo.Local;
            return TimeZoneInfo.ConvertTimeFromUtc(dateTime, timeZone);
        }

        [HttpGet("demands")]
        public IEnumerable<DailyDemandVM> GetDemands()
        {
            var start = new DateTimeOffset(2021, 01, 14, 0, 0, 0, TimeZoneInfo.Local.BaseUtcOffset);
            var end = start + TimeSpan.FromDays(1);
            var perPosition =
                from pos in db.Positions
                where pos.LifeTime.DeletedAt == null
                let demands = pos.Demands.Where(d => d.LifeTime.DeletedAt == null && d.Day >= start && d.Day < end)
                where demands.Any()
                select new
                {
                    PositionId = pos.Id,
                    Values =
                        from d in demands
                        select d.Value
                };

            foreach (var p in perPosition)
            {
                yield return DailyDemandVM.Create(p.PositionId, p.Values);
            };
        }
    }

    public class RomDbContext : DbContext
    {
        public RomDbContext(DbContextOptions<RomDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Position>(table => table.OwnsOne(t => t.LifeTime));
            modelBuilder.Entity<Demand>(table => table.OwnsOne(t => t.LifeTime));
            modelBuilder.Entity<Plan>(table => table.OwnsOne(t => t.LifeTime));
        }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Demand> Demands { get; set; }
        public DbSet<Plan> Plan { get; set; }
    }

    public class PositionVM
    {
        public Guid Id { get; set; }
        public IEnumerable<PositionVM> Children { get; set; }
        public string Name { get; set; }
    }

    public class DailyDemandVM
    {
        public Guid PositionId { get; set; }
        public IEnumerable<int> Values { get; private set; }
        public static DailyDemandVM Create(Guid positionId, IEnumerable<string> input)
        {
            return new DailyDemandVM
            {
                PositionId = positionId,
                Values = Merge(input.Select(Parse))
            };

            IEnumerable<int> Parse(string values)
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

    public class PositionSupplyVM
    {
        public Guid PositionId { get; internal set; }
        public Guid EmployeeId { get; internal set; }
        public TimeTableCell Start { get; internal set; }
        public TimeTableCell End { get; internal set; }
    }
}
