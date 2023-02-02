using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
	public class EmailAddress
	{
		public string Name { get; set; }
		public string Address { get; set; }

		public EmailAddress() { }
		public EmailAddress(string name, string address)
		{
			Name = name;
			Address = address;
		}
	}
}