using Api.Planning.Converters;
using Api.Planning.Models;
using Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Api.Domain;
using Api.Data;
using Api.Data.Linq;
using System.Linq.Expressions;

namespace Api.Planning.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlanningController : ControllerBase
    {
        private readonly JsonSerializerOptions jsonSerializerOptions;

        public PlanningController(IOptions<JsonOptions> options)
        {
            this.jsonSerializerOptions = options.Value.JsonSerializerOptions;
        }

        public JsonResult Json(object value, DateTimeOffset start) => new JsonResult(value, jsonSerializerOptions.Copy().Add(new TimeCellConverter(start)));
        public DateTimeOffset GetStart() => new DateTimeOffset(2021, 1, 4, 0, 0, 0, TimeZoneInfo.Local.BaseUtcOffset);

        [HttpGet("position-supply")]
        public JsonResult GetPositionSupply([FromServices] IRepository<Plan> planDs)
        {
            var start = GetStart();
            var span = new DateTimeSpan(start, TimeSpan.FromDays(1));

            var entries =
                from p in planDs.Query()
                where IsInRange(span).Apply(p.TimeLine) &&
                    p.EmployeeId.HasValue &&
                    p.Maintenance.DeletedAt == null &&
                    p.Position.Maintenance.DeletedAt == null
                let pos = p.Position
                select new
                {
                    PositionId = pos.Id,
                    EmployeeId = p.EmployeeId.Value,
                    p.TimeLine
                };

            return Json(entries, start);
        }

        [HttpGet("employees")]
        public JsonResult GetEmployees([FromServices] IRepository<Employee> employeeDs)
        {
            var start = GetStart();
            var span = new DateTimeSpan(start, TimeSpan.FromDays(1));

            var entries =
                from empl in employeeDs.Query()
                where empl.Maintenance.DeletedAt == null
                let shifts = from s in empl.Shifts
                             where IsInRange(span).Apply(s.TimeLine) && s.Maintenance.DeletedAt == null
                             select new ShiftModel
                             {
                                 Id = s.Id,
                                 Name = s.Name,
                                 TimeLine = s.TimeLine
                             }
                where shifts.Any()
                select new EmployeeModel
                {
                    FirstName = empl.FirstName,
                    LastName = empl.LastName,
                    Id = empl.Id,
                    Shifts = shifts
                };

            return Json(entries, start);
        }

        public struct DateTimeSpan
        {
            public DateTimeOffset Start { get; set; }
            public DateTimeOffset End { get; set; }
            public DateTimeSpan(DateTimeOffset start, TimeSpan duration)
            {
                Start = start;
                End = start + duration;
            }
        }

        static Expression<Func<TimeLine, bool>> IsInRange(DateTimeSpan span) =>
             tl => tl.StartTime < span.End && tl.EndTime > span.Start;



        [HttpGet("positions")]
        public IEnumerable<PositionModel> GetPositions([FromServices] IRepository<Position> positionDs)
        {
            var active =
                from p in positionDs.Query()
                where p.Maintenance.DeletedAt == null
                select new
                {
                    p.Id,
                    p.ParentId,
                    p.Name,
                    p.Shorthand,
                    p.DefaultColor
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
                        DefaultColor = pos.DefaultColor,
                        Children = ToTree(pos.Id)
                    };
                    yield return vm;
                }
            }
        }


        [HttpGet("demands")]
        public IEnumerable<DailyDemandModel> GetDemands([FromServices] IRepository<Position> positionDs)
        {
            var start = new DateTimeOffset(2021, 01, 14, 0, 0, 0, TimeZoneInfo.Local.BaseUtcOffset);
            var end = start + TimeSpan.FromDays(1);
            var perPosition =
                from pos in positionDs.Query()
                where pos.Maintenance.DeletedAt == null
                let demands = pos.Demands.Where(d => d.Maintenance.DeletedAt == null && d.Day >= start && d.Day < end)
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
        public object GetTracks([FromServices] IRepository<Plan> planDs)
        {
            var start = GetStart();
            var span = new DateTimeSpan(start, TimeSpan.FromDays(1));

            var entries =
                from p in planDs.Query()
                where IsInRange(span).Apply(p.TimeLine) &&
                    p.Maintenance.DeletedAt == null &&
                    p.TrackGuid.HasValue
                select new TrackModel
                {
                    Id = p.Id,
                    TrackId = p.TrackId,
                    TrackGuid = p.TrackGuid.Value,
                    TimeLine = p.TimeLine,
                    GroupingTrackId = p.GroupingTrackId,
                    PositionId = p.PositionId,
                    Employee = new EmployeeModel
                    {
                        Id = p.EmployeeId,
                        FirstName = p.Employee.FirstName,
                        LastName = p.Employee.LastName,
                    }
                };

            return Json(entries, start);
        }
    }
}
