using System;
using System.Collections.Generic;
using System.Text;

namespace Api.WebData.Controllers
{
    public class EntityUpdateModel<T>
    {
        public T Values { get; set; }
        public string Version { get; set; }

    }
}
