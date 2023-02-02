using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Models.FrontEnd
{
    public class ResetPasswordRequest
    {
        public string Code { get; set; }
        public string Password { get; set; }
        public string OldPassword { get; set; }
    }
}