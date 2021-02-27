using Api.Data;
using Api.Domain;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Api.Utils
{
    public class DbSetRepository<T> : IRepository<T> where T: class
    {
        private readonly DbContext db;

        public DbSetRepository(DbContext db)
        {
            this.db = db;
        }

        public IQueryable<T> Query()
        {
            return new QueryTranslator<T>(this.db.Set<T>().AsNoTracking());
        }
    }
}
