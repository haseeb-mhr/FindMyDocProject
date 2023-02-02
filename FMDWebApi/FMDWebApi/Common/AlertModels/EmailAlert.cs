using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
    public partial class EmailAlert
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Subject { get; set; }
        public string Template { get; set; }
        public string SendTo { get; set; }
        public string SendCc { get; set; }
        public string SendBcc { get; set; }
        public byte IsEnabled { get; set; }
    }
}