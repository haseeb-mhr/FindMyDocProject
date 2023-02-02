using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Models.FrontEnd
{
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}