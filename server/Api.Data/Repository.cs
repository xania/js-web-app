using System.Linq;

namespace Api.Data
{
    public interface IRepository<T>
    {
        IQueryable<T> Query();
    }
}
