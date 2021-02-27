using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Api.Data
{
    public class EFDataSource<T> : IDataSource<T> where T: class
    {
        private readonly DbContext db;

        public EFDataSource(DbContext db)
        {
            this.db = db;
        }

        public IQueryable<T> Query()
        {
            return new QueryTranslator<T>(this.db.Set<T>().AsNoTracking());
        }
    }
}
