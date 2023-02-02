using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
    public class EmailVerificationAlert
    {
        public string Email { get; set; }
        public int VerificationCode { get; set; }
        public string LinkExpiry { get; set; }
    }
}