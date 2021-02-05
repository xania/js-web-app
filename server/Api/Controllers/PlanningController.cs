using Api.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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

            return ToVM(null);
            IEnumerable<PositionVM> ToVM(Guid? parentId)
            {
                foreach (var pos in childrenLookup[parentId].OrderBy(e => e.Name))
                {
                    var vm = new PositionVM
                    {
                        Id = pos.Id,
                        Name = pos.Name,
                        Children = ToVM(pos.Id)
                    };
                    yield return vm;
                }
            }
        }
    }
    
    public class RomDbContext: DbContext
    {
        public RomDbContext(DbContextOptions<RomDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Position>(table =>
            {
                table.OwnsOne(t => t.LifeTime);
            });
        }
        public DbSet<Position> Positions { get; set; }
    }

    public class PositionVM
    {
        public Guid Id { get; set; }
        public IEnumerable<PositionVM> Children { get; set; }
        public string Name { get; set; }
    }

}
