using Api.Planning.Converters;
using Api.Planning.Models;
using Api.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace Api.Planning.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlanningController : ControllerBase
    {
        private readonly JsonSerializerOptions jsonSerializerOptions;
        private readonly IPlanningDbContext db;

        public PlanningController(IPlanningDbContext db, IOptions<JsonOptions> options)
        {
            this.jsonSerializerOptions = options.Value.JsonSerializerOptions;
            this.db = db;
        }

        public JsonResult Json(object value, DateTimeOffset start) => new JsonResult(value, jsonSerializerOptions.Copy().Add(new TimeCellConverter(start)));
        public DateTimeOffset GetStart() => new DateTimeOffset(2021, 1, 4, 0, 0, 0, TimeZoneInfo.Local.BaseUtcOffset);

        [HttpGet("position-supply")]
        public JsonResult GetPositionSupply()
        {
            var start = GetStart();
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

            return Json(entries, start);
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
                    p.Name,
                    p.Shorthand
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
                        Shorthand = pos.Shorthand,
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

        [HttpGet("tracks")]
        public object GetTracks()
        {
            var start = GetStart();
            var end = start + TimeSpan.FromDays(1);

            var entries =
                from p in this.db.Plan
                where p.LifeTime.DeletedAt == null &&
                    p.StartTime < end &&
                    p.EndTime > start &&
                    p.TrackGuid.HasValue &&
                    (p.EmployeeId == null || p.Employee.LifeTime.DeletedAt == null)
                select new SubTrackModel
                {
                    Id = p.Id,
                    TrackId = p.TrackId,
                    TrackGuid = p.TrackGuid.Value,
                    StartTime = p.StartTime,
                    EndTime = p.EndTime,
                    GroupingTrackId = p.GroupingTrackId,
                    PositionId = p.PositionId,
                    Employee = new EmployeeModel
                    {
                        FirstName = p.Employee.FirstName,
                        LastName = p.Employee.LastName,
                    }
                };

            var groups = from entry in entries.Take(100).AsEnumerable()
                         group entry by entry.GroupingTrackId into g
                         orderby g.Key
                         select new
                         {
                             Id = g.Key,
                             SubTracks = g.GroupBy(x => x.TrackId).ToDictionary(e => e.Key, e => e.OrderBy(e => e.TrackId).ToArray())
                         };

            //return groups;
            return Json(groups, start);
        }
    }
}
