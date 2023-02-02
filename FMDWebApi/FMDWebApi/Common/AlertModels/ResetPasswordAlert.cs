using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
    public class ResetPasswordAlert
    {
        public int UserId { get; set; }
        public string ResetPasswordLink { get; set; }
        public string LinkExpiry { get; set; }
    }
}