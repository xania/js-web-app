using System.Collections.Generic;

namespace Api.Finance
{
    public class Invoice
    {
        public string InvoiceNumber { get; set; }
        public string Description { get; set; }
        public string Owner { get; set; }
        public string CompanyId { get; set; }
        public string Date { get; set; }
        public IEnumerable<HourDeclaration> Declarations { get; set; }
    }

    public class Company
    {
        public string Name { get; set; }
        public string Contact { get; set; }
        public Address Address { get; set; }
        public decimal HourlyRate { get; set; } = 80;
    }

    public class Address
    {
        public string ZipCode { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
    }

    public class HourDeclaration
    {
        public float Hours { get; set; }    
        public string Description { get; set; }
    }
}
