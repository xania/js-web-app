using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace Api.Data.EFCore
{
    public static class DbContextExtensions
    {
        public static IServiceCollection RegisterDbSetRepositories<TDbContext>(this IServiceCollection services)
        {
            foreach (var entityType in GetEntityTypes<TDbContext>())
            {
                var serviceType = typeof(IRepository<>).MakeGenericType(entityType);
                var concreteType = typeof(DbSetRepository<>).MakeGenericType(entityType);
                services.AddScoped(serviceType, sp => Activator.CreateInstance(concreteType, sp.GetRequiredService<TDbContext>()));
            }

            return services;
        }

        public static void RegisterComplexTypes<TDbContext>(this ModelBuilder modelBuilder)
        {
            foreach (var entityType in GetEntityTypes<TDbContext>())
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

        public static IEnumerable<Type> GetEntityTypes<TDbContext>()
        {
            foreach (var prop in typeof(TDbContext).GetProperties())
            {
                if (!prop.PropertyType.IsGenericType || prop.PropertyType.GetGenericTypeDefinition() != typeof(DbSet<>))
                {
                    continue;
                }
                yield return prop.PropertyType.GetGenericArguments()[0];
            }
        }
    }
}
