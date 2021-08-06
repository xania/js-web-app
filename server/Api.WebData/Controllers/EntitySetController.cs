using Api.WebData.Store;
using Api.WebData.Store.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Api.WebData.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Policy = "data")]
    public class EntitySetController<T> : Controller
    {
        public EntitySetController(DataStoreProvider storeProvider)
        {
            this.StoreProvider = storeProvider;
        }

        protected virtual string Scope => this.ControllerContext.ActionDescriptor.ControllerName;

        protected virtual IEntityEnumerator<T> Collection
        {
            get => EntitySet.EnumeratorEntities();
        }

        protected virtual EntitySet<T> EntitySet
        {
            get => StoreProvider.Set<T>(scope: Scope);
        }

        protected DataStoreProvider StoreProvider { get; }

        //[HttpGet]
        //[RequestAccepts("application/json")]
        //public IEnumerable<object> List()
        //{
        //    Response.ContentType = "application/json";

        //    using var entityEnumerator = Collection.Take(50);
        //    while (entityEnumerator.TryMoveNext(null))
        //    {
        //        var entity = entityEnumerator.Current;
        //        yield return new
        //        {
        //            id = entity.Id,
        //            version = entity.Version.ToString(CultureInfo.InvariantCulture),
        //            values = entity.Content,
        //        };
        //    }
        //}

        //[HttpGet("{term}")]
        //[RequestAccepts("application/json")]
        //public IEnumerable<object> Search(string term)
        //{
        //    Response.ContentType = "application/json";
        //    using var entityEnumerator = Collection.Search(term).Take(50);
        //    while (entityEnumerator.TryMoveNext(null))
        //    {
        //        var entity = entityEnumerator.Current;
        //        yield return new
        //        {
        //            id = entity.Id,
        //            version = entity.Version.ToString(CultureInfo.InvariantCulture),
        //            values = entity.Content
        //        };
        //    }
        //}

        [HttpGet("{id:guid}")]
        [Consumes("application/json")]
        public object Get(Guid id)
        {
            var path = $"{Scope}/{id}";
            var entity = Collection.FirstOrDefault(e => e.Id == id);
            if (entity == null || entity.IsEmpty)
                return null;

            return CreateEntity(entity.Id, entity.Version, entity.Content);
        }

        private object CreateEntity(Guid id, long version, T values)
        {
            var path = $"{Scope}/{id}";
            return new
            {
                Id = id,
                Version = version.ToString(CultureInfo.InvariantCulture),
                Values = values,
                Url = "/" + path.Replace("\\", "/", StringComparison.InvariantCultureIgnoreCase)
            };
        }

        [HttpPost("create")]
        [Consumes("application/json")]
        public virtual IEnumerable<object> Create([FromBody] T values)
        {
            return EntitySet.Add(values).Select(e => new {
                Id = e.id,
                Version = e.version.ToString(CultureInfo.InvariantCulture)
            });
        }

        [HttpPost]
        [Consumes("application/json")]
        public virtual IEnumerable<Guid> Add([FromBody] T values)
        {
            return EntitySet.Add(values).Select(e => e.id);
        }

        [HttpPut("{id:guid}")]
        [Consumes("application/json")]
        public async ValueTask<IActionResult> Update(Guid id, [FromBody] EntityUpdateModel<T> model)
        {
            if (!ModelState.IsValid || model == null || model.Values == null)
                return BadRequest(ModelState);


            if (!long.TryParse(model.Version, out var version))
            {
                var (_, v) = EntitySet.Add(new EntityAdd<T>(id, model.Values)).Single();
                return Ok(CreateEntity(id, v, model.Values));
            }

            var updateTask = EntitySet.UpdateAsync(id, version, model.Values);
            if (updateTask != null)
                await updateTask;

            return Ok(Get(id));
        }
    }
}
