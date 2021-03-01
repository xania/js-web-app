using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Api.Data.EFCore
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
            return new Data.Linq.QueryTranslator<T>(this.db.Set<T>().AsNoTracking());
        }
    }
}
