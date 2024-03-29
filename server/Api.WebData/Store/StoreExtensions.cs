using Api.WebData.Store.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Store
{
    public static class StoreExtensions
    {
        public static EntitySet<T> Set<T>(this DataStoreProvider provider, string scope = default)
        {
            var store = provider.Get(scope ?? typeof(T).Name.ToLowerInvariant());
            return new EntitySet<T>(store);
        }

        public static EntitySet<T> Set<T>(this DataStore store)
        {
            return new EntitySet<T>(store);
        }
    }
}
