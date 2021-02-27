using Api.Domain;
using Api.Planning;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json;

namespace Api.Controllers
{
    public class RomDbContext : DbContext
    {
        public RomDbContext(DbContextOptions<RomDbContext> options)
            : base(options)
        {
        }

        public DbSet<Position> Positions { get; set; }
        public DbSet<Demand> Demands { get; set; }
        public DbSet<Plan> Plan { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<PlanDetail> PlanDetails { get; set; }
        public DbSet<Shift> Shifts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            RegisterComplexTypes(modelBuilder);

            modelBuilder.Entity<PlanDetail>()
                .Property(x => x.Remark)
                .HasConversion(
                    x => SerializeObject(x),
                    x => Deserialize<ICollection<string>>(x));
            modelBuilder.Entity<PlanDetail>()
                .Property(x => x.SendRemark)
                .HasConversion(
                    x => SerializeObject(x),
                    x => Deserialize<ICollection<string>>(x));
            modelBuilder.Entity<PlanDetail>()
                .Property(x => x.Highlight)
                .HasConversion(
                    x => SerializeObject(x),
                    x => Deserialize<ICollection<string>>(x));
        }

        private static void RegisterComplexTypes(ModelBuilder modelBuilder)
        {
            foreach (var entityType in GetEntityTypes())
            {
                var entity = modelBuilder.Entity(entityType);
                foreach (var propertyInfo in entityType.GetProperties())
                {
                    var isComplexProperty = propertyInfo.PropertyType.CustomAttributes.Any(e => e.AttributeType == typeof(ComplexTypeAttribute));
                    if (isComplexProperty)
                    {
                        entity.OwnsOne(propertyInfo.PropertyType, propertyInfo.Name);
                    }
                }
            }
        }

        public static IEnumerable<System.Type> GetEntityTypes()
        {
            foreach (var prop in typeof(RomDbContext).GetProperties())
            {
                if (!prop.PropertyType.IsGenericType || prop.PropertyType.GetGenericTypeDefinition() != typeof(DbSet<>))
                {
                    continue;
                }
                yield return prop.PropertyType.GetGenericArguments()[0];
            }
        }

        private static string SerializeObject<T>(T obj)
        {
            return JsonSerializer.Serialize(obj);
        }

        private static T Deserialize<T>(string json)
        {
            return JsonSerializer.Deserialize<T>(json);
        }
    }
}
