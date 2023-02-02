using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
	public class EmailMessage
	{
		public IList<EmailAddress> RecipientToList { get; set; } = new List<EmailAddress>();
		public IList<EmailAddress> RecipientCcList { get; set; } = new List<EmailAddress>();
		public IList<EmailAddress> RecipientBccList { get; set; } = new List<EmailAddress>();
		public int Id { get; set; }
		public string Subject { get; set; }
		public string Content { get; set; }

		public enum EmailMessageStatus
		{
			pending,
			sent,
			failed
		}
	}
}