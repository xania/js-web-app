using Api.WebData.Controllers;
using Api.WebData.Store;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Finance
{
    public class InvoiceController : EntitySetController<Invoice>
    {
        public InvoiceController(DataStoreProvider storeProvider) : base(storeProvider)
        {
        }
    }
}
