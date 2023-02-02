using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Models.FrontEnd
{
    public class ContactUs
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ContactNo { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
        public bool isRegistered { get; set; }

    }
}