using System.Linq;

namespace Api.Domain
{
    public interface IRepository<T>
    {
        IQueryable<T> Query();
    }
}
