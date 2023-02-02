using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
    public partial class EmailQueueEntry
    {
        [Key]
        public int Id { get; set; }
        public string RecipientToList { get; set; }
        public string RecipientCcList { get; set; }
        public string RecipientBccList { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
        public string ExceptionMessage { get; set; }
        public string ExceptionStackTrace { get; set; }
        public DateTimeOffset CreateTime { get; set; }
        public DateTimeOffset? UpdateTime { get; set; }
        public byte Deleted { get; set; }
    }
}