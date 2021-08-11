using Api.Finance.Helpers;
using Api.WebData.Controllers;
using Api.WebData.Store;
using Api.WebData.Store.Entities;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("{id:guid}/pdf")]
        public object DownloadPDF(Guid id)
        {
            var reportData = CreateReportData(id);
            if (reportData == null) return NotFound();

            var generateFunc = InvoiceReportGenerator.Generate(reportData);
            return new FuncActionResult(generateFunc, $"Fact { reportData.Invoice.InvoiceNumber } - {reportData.Company.Name}.pdf");
        }

        private InvoiceReportDataTO CreateReportData(Guid id)
        {
            var invoice = Collection
                .Where(e => e.Id == id)
                .Select(e => e.Content)
                .FirstOrDefault();
            if (invoice == null) return null;
            var company = GetCompany(invoice.CompanyId);


            var invoiceDate = string.IsNullOrEmpty(invoice.Date) ? DateTimeOffset.Now : DateTimeOffset.Parse(invoice.Date);

            return new InvoiceReportDataTO
            {
                Invoice = new InvoiceTO
                {
                    ExpirationDate = invoiceDate + TimeSpan.FromDays(30),
                    Date = invoiceDate,
                    InvoiceNumber = invoice.InvoiceNumber,
                    Declarations =
                        from l in (invoice.Declarations ?? Enumerable.Empty<HourDeclaration>())
                        select new LineItemTO
                        {
                            Hours = l.Hours,
                            Description = l.Description,
                            Tax = 0.21m,
                            UnitPrice = company?.HourlyRate ?? 0
                        },
                    Description = invoice.Description
                },
                Company = company == null ? null : new CompanyTO
                {
                    Id = 1,
                    LogoImageId = 1,
                    AddressLines = new[]
                    {
                        $"t.n.v {company.Contact}\n" +
                        company.Name,
                        $"{company.Address.Street}\n" +
                        $"{company.Address.ZipCode}, {company.Address.City}\n" +
                        "Nederland"
                    },
                    Name = company.Name
                },
                Sender = new SenderTO
                {
                    Name = "Xania Software",
                    BankAccount = "NL61 INGB 0005 8455 00"
                }
            };
        }

        private Company GetCompany(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return null;

            return new Company
            {
                Address = new Address { 
                    City = "Amsterdam",
                    Street = "Aert van Nesstraat 45", 
                    ZipCode = "3012 CA" 
                },
                Contact = "Rick van Eeden",
                Name = "R2 Group",
                HourlyRate = 85
            };
        }


    }
}
