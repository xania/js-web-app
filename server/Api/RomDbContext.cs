using Api.Domain;
using Api.Planning;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    public class RomDbContext : DbContext, IPlanningDbContext
    {
        public RomDbContext(DbContextOptions<RomDbContext> options)
            : base(options)
        {
        }

        public DbSet<Position> Positions { get; set; }
        public DbSet<Demand> Demands { get; set; }
        public DbSet<Plan> Plan { get; set; }
        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Position>(table => table.OwnsOne(t => t.LifeTime));
            modelBuilder.Entity<Demand>(table => table.OwnsOne(t => t.LifeTime));
            modelBuilder.Entity<Plan>(table => table.OwnsOne(t => t.LifeTime));
            modelBuilder.Entity<Employee>(table => table.OwnsOne(t => t.LifeTime));
        }
    }
}
