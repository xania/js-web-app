using System.Linq;

namespace Api.Data
{
    public interface IDataSource<T>
    {
        IQueryable<T> Query();
    }
}
