using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
    public class UserEmailCheck
    {
        public bool InToList { get; set; }
        public bool InCcList { get; set; }
        public bool InBccList { get; set; }
    }
}