using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Common.AlertModels
{
    public class EmailTemplateVariable
    {
        public const string ResetPasswordLink = "reset_password_link";
        public const string EmailVerificationCode = "email_verification_code";
        public const string LinkExpiry = "link_expiry";
        public const string FirstName = "first_name";
        public const string LastName = "last_name";
        public const string PersonCNIC = "person_cnic";
        public const string ContactNumber = "contact_number";
        public const string ContactEmail = "contact_email";
        public const string Description = "description";
        
    }
}