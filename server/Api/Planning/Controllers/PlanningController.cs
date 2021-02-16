using Api.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Api.Planning.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlanningController : ControllerBase
    {
        private readonly IPlanningDbContext db;

        public PlanningController(IPlanningDbContext db)
        {
            this.db = db;
        }

        [HttpGet("position-supply")]
        public IEnumerable<PositionSupplyModel> GetPositionSupply()
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
                select new PositionSupplyModel
                {
                    PositionId = entry.PositionId,
                    EmployeeId = entry.EmployeeId,
                    Start = entry.StartTime.Max(start) - start,
                    End = entry.EndTime.Ceiling().Min(end) - start
                };
        }

        [HttpGet("positions")]
        public IEnumerable<PositionModel> GetPositions()
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
            IEnumerable<PositionModel> ToTree(Guid? parentId)
            {
                foreach (var pos in childrenLookup[parentId].OrderBy(e => e.Name))
                {
                    var vm = new PositionModel
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
        public IEnumerable<DailyDemandModel> GetDemands()
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
                yield return DailyDemandModel.Create(p.PositionId, p.Values);
            };
        }
    }
}
