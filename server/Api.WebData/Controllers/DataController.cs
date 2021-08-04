using Api.WebData.Store;
using Api.WebData.Store.Entities;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Api.WebData.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController: Controller
    {
        private readonly DataStoreProvider storeProvider;

        public DataController(DataStoreProvider storeProvider)
        {
            this.storeProvider = storeProvider;
        }

        [Route("{*path}")]
        [HttpGet]
        public string Get(string path)
        {
            path = Substitute(path);
            var store = storeProvider.Get(path);
            var entity = new EntityAdd<Person>(Guid.NewGuid(), new Person
            {
                FirstName = "Ibrahim ben Salah"
            });

            store.Add(new [] { entity });
            storeProvider.Set<Person>();

            var count = 0;
            var enumerator = store.GetEnumerator();
            while(enumerator.TryMoveNext())
            {
                count++;
            }

            return path + " " + count;
        }

        private string Substitute(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return value;
            if (User.Identity.IsAuthenticated)
                return value.Replace("[user]", User.Identity.Name.ToUpperInvariant(), System.StringComparison.InvariantCultureIgnoreCase);
            return value;
        }
    }

    class Person
    {
        public string FirstName { get; set; }
    }
}
