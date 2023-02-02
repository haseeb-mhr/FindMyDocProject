using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using FMDWebApi.DAL;
using FMDWebApi.Common.AlertModels;
using FMDWebApi.Models;
using FMDWebApi.Models.FrontEnd;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace FMDWebApi.Common.Services
{
    public class EmailAlertQueue : IAlert, IEmailAlertQueue
    {
        private IServiceScopeFactory _serviceScopeFactory;
        private readonly Queue<EmailMessage> emailQueueToSend = new Queue<EmailMessage>();
        private SemaphoreSlim _signal = new SemaphoreSlim(0);
        public EmailAlertQueue(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        // smtp.gmail.com
        public string SmtpServer => GetValue<string>("SmtpServer");
        public int SmtpPort => GetValue<int>("SmtpPort");
        public string SmtpUsername => GetValue<string>("SmtpUsername");
        public string SmtpPassword => GetValue<string>("SmtpPassword");
        public EmailAddress SmtpFrom => GetEmailFromValue();
        public EmailAddress GetEmailFromValue()
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
            using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
            {
                EmailAddress emailAddress = new EmailAddress();
                emailAddress.Name = dbContext.Settings.Where(x => x.Key == "SmtpFromName").Select(x => x.Value).FirstOrDefault();
                emailAddress.Address = dbContext.Settings.Where(x => x.Key == "SmtpFromEmail").Select(x => x.Value).FirstOrDefault();
                return emailAddress;
            }
        }
        public T GetValue<T>(string key)
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
            using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
            {
                object dbValue;
                dbValue = dbContext.Settings.Where(x => x.Key.Equals(key)).Select(x => x.Value).FirstOrDefault();
                if (dbValue == null)
                    throw new Exception(key + "property is missing in configuration");
                return (T)Convert.ChangeType(dbValue, typeof(T));
            }
        }

        public void RaiseContactUsEmailAlert(ContactUs contactUs)
        {
            try
            {
                //check if the reset password alert is enabled in Database
                if (!IsAlertEnabled(AlertTemplateName.ContactUs.ToString()))
                    return;
                EmailMessage emailMessage = GetPopulatedEmailTemplate(AlertTemplateName.ContactUs, out UserEmailCheck userEmailCheck);
                ContactUsEmailPopulation(contactUs, userEmailCheck, emailMessage);
            }
            catch (Exception e)
            {
                throw new Exception(e + "Error in generating reset password email alert");
            }
        }

        public void RaiseResetPasswordEmailAlert(ResetPasswordAlert resetPasswordAlert)
        {
            try
            {
                //check if the reset password alert is enabled in Database
                if (!IsAlertEnabled(AlertTemplateName.ResetPassword.ToString()))
                    return;
                EmailMessage emailMessage = GetPopulatedEmailTemplate(AlertTemplateName.ResetPassword, out UserEmailCheck userEmailCheck);
                ResetPasswordEmailPopulation(resetPasswordAlert, userEmailCheck, emailMessage);
            }
            catch (Exception e)
            {
                throw new Exception(e + "Error in generating reset password email alert");
            }
        }

        public void RaiseEmailVerificationAlert(EmailVerificationAlert emailVerificationAlert)
        {
            try
            {
                //check if the reset password alert is enabled in Database
                if (!IsAlertEnabled(AlertTemplateName.EmailVerification.ToString()))
                    return;
                EmailMessage emailMessage = GetPopulatedEmailTemplate(AlertTemplateName.EmailVerification, out UserEmailCheck userEmailCheck);
                EmailVerificationPopulation(emailVerificationAlert, userEmailCheck, emailMessage);
            }
            catch (Exception e)
            {
                throw new Exception(e + "Error in generating reset password email alert");
            }
        }

        public void RaiseResetPasswordSuccessEmailAlert(int userId)
        {
            try
            {
                if (!IsAlertEnabled(AlertTemplateName.ResetPasswordSuccess.ToString()))
                    return;
                EmailMessage emailMessage = GetPopulatedEmailTemplate(AlertTemplateName.ResetPasswordSuccess, out UserEmailCheck userEmailCheck);
                ResetPasswordSuccessEmailPopulation(userId, userEmailCheck, emailMessage);
            }
            catch (Exception)
            {
               // Log.Error(e, "Error in generating reset password success email alert");
            }
        }

        private void ResetPasswordSuccessEmailPopulation(int userId, UserEmailCheck userEmailCheck, EmailMessage emailMessage)
        {
            AddUserAsRecipient(GetUserEmail(userId), userEmailCheck, emailMessage);
            GetReadyToSendEmail(emailMessage);
        }

        public bool IsAlertEnabled(string templateName)
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
                using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
                {
                    EmailAlert alertEmail = dbContext.EmailAlerts.SingleOrDefault(x => x.Name == templateName);
                    if (alertEmail != null && alertEmail.IsEnabled == 1)
                        return true;
                }
            return false;
        }

        private EmailMessage GetPopulatedEmailTemplate(AlertTemplateName templateName, out UserEmailCheck userEmailCheck)
        {
            var alertEmail = GetEmailTemplate(templateName.ToString());
            var emailMessage = new EmailMessage();
            emailMessage.Subject = alertEmail.Subject;
            emailMessage.Content = alertEmail.Template;
            userEmailCheck = PopulateRecipientList(emailMessage, alertEmail);
            return emailMessage;
        }

        public EmailAlert GetEmailTemplate(string templateName)
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
            using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
            {
                return dbContext.EmailAlerts.SingleOrDefault(x => x.Name == templateName);
            }
        }

        private UserEmailCheck PopulateRecipientList(EmailMessage emailMessage, EmailAlert alertEmail)
        {
            bool userSendTo = false;
            bool userSendCc = false;
            bool userSendBcc = false;
            //Checking if the SentTo Column of Database contain a value
            if (alertEmail.SendTo != null && alertEmail.SendTo.Length > 0)
                emailMessage.RecipientToList = GetEmailsFromList(alertEmail.SendTo.Split(';'), ref userSendTo);
            if (alertEmail.SendCc != null && alertEmail.SendCc.Length > 0)
                emailMessage.RecipientCcList = GetEmailsFromList(alertEmail.SendCc.Split(';'), ref userSendCc);
            if (alertEmail.SendBcc != null && alertEmail.SendBcc.Length > 0)
                emailMessage.RecipientBccList = GetEmailsFromList(alertEmail.SendBcc.Split(';'), ref userSendBcc);
            return new UserEmailCheck()
            {
                InToList = userSendTo,
                InCcList = userSendCc,
                InBccList = userSendBcc
            };
        }

        //Check Whom to send the Email and if to send the email to Support and Dev Then get the Email.
        private IList<EmailAddress> GetEmailsFromList(string[] recipients, ref bool userEmailCheck)
        {
            List<string> recipientList = new List<string>(recipients);
            IList<EmailAddress> emailAddresses = new List<EmailAddress>();
            if (recipientList.Count < 1)
            {
                userEmailCheck = false;
                return emailAddresses;
            }

            if (recipientList.Any(s => s.Equals("user", StringComparison.OrdinalIgnoreCase)))
            {
                userEmailCheck = true;
                recipientList.Remove("user");
            }
            else
            {
                userEmailCheck = false;
            }

            foreach (string email_key in recipientList)
            {
                string[] Addresses = GetValue(email_key).Trim().Split(';');
                foreach (var address in Addresses)
                {
                    emailAddresses.Add(new EmailAddress()
                    {
                        Name = "",
                        Address = address
                    });
                }
            }
            return emailAddresses;
        }

        private string GetValue(string key)
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
            using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
            {
                return dbContext.Settings.Where(x => x.Key == key).Select(x => x.Value).Single();
            }
        }

        private void ResetPasswordEmailPopulation(ResetPasswordAlert resetPasswordAlert, UserEmailCheck userEmailCheck, EmailMessage emailMessage)
        {
            PopulateContentInTemplate(resetPasswordAlert, emailMessage);
            AddUserAsRecipient(GetUserEmail(resetPasswordAlert.UserId), userEmailCheck, emailMessage);
            GetReadyToSendEmail(emailMessage);
        }

        private void EmailVerificationPopulation(EmailVerificationAlert emailVerificationAlert, UserEmailCheck userEmailCheck, EmailMessage emailMessage)
        {
            PopulateContentInTemplate(emailVerificationAlert, emailMessage);
            AddUserAsRecipient(emailVerificationAlert.Email, userEmailCheck, emailMessage);
            GetReadyToSendEmail(emailMessage);
        }

        private void ContactUsEmailPopulation(ContactUs contactUs, UserEmailCheck userEmailCheck, EmailMessage emailMessage)
        {
            PopulateContentInContactUsTemplate(contactUs, emailMessage);
            AddUserAsRecipient(GetContactUsEmail(), userEmailCheck, emailMessage);
            GetReadyToSendEmail(emailMessage);
        }

        private void PopulateContentInContactUsTemplate(ContactUs contactUs, EmailMessage emailMessage)
        {
            UpdateEmailMessageText(EmailTemplateVariable.FirstName, contactUs.FirstName, emailMessage);
            UpdateEmailMessageText(EmailTemplateVariable.LastName, contactUs.LastName, emailMessage);
            UpdateEmailMessageText(EmailTemplateVariable.PersonCNIC, "No CNIC is Used.", emailMessage);
            UpdateEmailMessageText(EmailTemplateVariable.ContactNumber, contactUs.ContactNo, emailMessage);
            UpdateEmailMessageText(EmailTemplateVariable.ContactEmail, contactUs.Email, emailMessage);
            UpdateEmailMessageText(EmailTemplateVariable.Description, contactUs.Description, emailMessage);
        }

        private void PopulateContentInTemplate(ResetPasswordAlert alertDataToPopulate, EmailMessage emailMessage)
        {
            UpdateEmailMessageText(EmailTemplateVariable.LinkExpiry, alertDataToPopulate.LinkExpiry, emailMessage);
            UpdateEmailMessageText(EmailTemplateVariable.ResetPasswordLink, alertDataToPopulate.ResetPasswordLink, emailMessage);
        }

        private void PopulateContentInTemplate(EmailVerificationAlert emailVerificationAlert, EmailMessage emailMessage)
        {
            UpdateEmailMessageText(EmailTemplateVariable.LinkExpiry, emailVerificationAlert.LinkExpiry, emailMessage);
            UpdateEmailMessageText(EmailTemplateVariable.EmailVerificationCode, emailVerificationAlert.VerificationCode.ToString(), emailMessage);
        }

        private void AddUserAsRecipient(string userEmailAddress, UserEmailCheck userEmailCheck, EmailMessage emailMessage)
        {
            if (userEmailCheck.InToList)
            {
                emailMessage.RecipientToList.Add(new EmailAddress()
                {
                    Name = "",
                    Address = userEmailAddress
                });
            }
            if (userEmailCheck.InCcList)
            {
                emailMessage.RecipientCcList.Add(new EmailAddress()
                {
                    Name = "",
                    Address = userEmailAddress
                });
            }
            if (userEmailCheck.InBccList)
            {
                emailMessage.RecipientBccList.Add(new EmailAddress()
                {
                    Name = "",
                    Address = userEmailAddress
                });
            }
        }

        private string GetContactUsEmail()
        {
            try
            {
                using (IServiceScope scope = _serviceScopeFactory.CreateScope())
                using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
                {
                    return dbContext.Settings.Where(x => x.Key == "support_email").Select(x => x.Value).Single();
                }
            }
            catch (ArgumentNullException)
            {
                throw new Exception("Support Contact is required for this alert");
            }
        }

        private string GetUserEmail(int userId)
        {
            try
            {
                using (IServiceScope scope = _serviceScopeFactory.CreateScope())
                using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
                {
                    return dbContext.Users.Where(x => x.Id == userId).Select(x => x.Email).Single();
                }
            }
            catch (ArgumentNullException)
            {
                throw new Exception("User is required for this alert");
            }
        }

        private void GetReadyToSendEmail(EmailMessage emailMessage)
        {
            Store(emailMessage);
            emailQueueToSend.Enqueue(emailMessage);
            _signal.Release();
        }

        public void Store(EmailMessage emailMessage)
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
            using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
            {
                EmailQueueEntry emailQueueEntry = new EmailQueueEntry()
                {
                    RecipientToList = string.Join(";", emailMessage.RecipientToList.Select(x => x.Address)),
                    RecipientCcList = string.Join(";", emailMessage.RecipientCcList.Select(x => x.Address)),
                    RecipientBccList = string.Join(";", emailMessage.RecipientCcList.Select(x => x.Address)),
                    Subject = emailMessage.Subject,
                    Content = emailMessage.Content,
                    Status = EmailMessage.EmailMessageStatus.pending.ToString()
                };
                dbContext.EmailQueueEntrys.Add(emailQueueEntry);
                dbContext.SaveChanges();
                emailMessage.Id = emailQueueEntry.Id;
            }
        }

        public void UpdateAsComplete(EmailMessage emailMessage)
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
            using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
            {
                EmailQueueEntry emailQueueEntry = dbContext.EmailQueueEntrys.Find(emailMessage.Id);
                emailQueueEntry.Status = EmailMessage.EmailMessageStatus.sent.ToString();
                dbContext.SaveChanges();
            }
        }

        public void UpdateAsFailed(EmailMessage emailMessage, Exception e)
        {
            using (IServiceScope scope = _serviceScopeFactory.CreateScope())
            using (FMDDbContext dbContext = scope.ServiceProvider.GetRequiredService<FMDDbContext>())
            {
                EmailQueueEntry emailQueueEntry = dbContext.EmailQueueEntrys.Find(emailMessage.Id);
                emailQueueEntry.Status = EmailMessage.EmailMessageStatus.failed.ToString();
                emailQueueEntry.ExceptionMessage = e.Message.ToString();
                emailQueueEntry.ExceptionStackTrace = e.StackTrace.ToString();
                dbContext.SaveChanges();

            }
        }

        private void UpdateEmailMessageText(string variable, string value, EmailMessage emailMessage)
        {
            emailMessage.Subject = emailMessage.Subject.Replace("[[%" + variable + "%]]", value);
            emailMessage.Content = emailMessage.Content.Replace("[[%" + variable + "%]]", value);
        }

        public async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await _signal.WaitAsync();
            EmailMessage emailMessage = emailQueueToSend.Dequeue();
            try
            {
                var message = new MimeMessage();
                message.To.AddRange(emailMessage.RecipientToList.Select(x => new MailboxAddress(x.Name, x.Address)));
                message.Cc.AddRange(emailMessage.RecipientCcList.Select(x => new MailboxAddress(x.Name, x.Address)));
                message.Bcc.AddRange(emailMessage.RecipientBccList.Select(x => new MailboxAddress(x.Name, x.Address)));
                EmailAddress fromAddress = SmtpFrom;
                message.From.Add(new MailboxAddress(fromAddress.Name, fromAddress.Address));

                message.Subject = emailMessage.Subject;
                //We will say we are sending HTML. But there are options for plaintext etc. 
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = emailMessage.Content
                };
                //Be careful that the SmtpClient class is the one from Mailkit not the framework!
                using (var emailClient = new SmtpClient())
                {
                    //The last parameter here is to use SSL (Which you should!)
                    emailClient.Connect(SmtpServer, SmtpPort, false);
                    //Remove any OAuth functionality as we won't be using it. 
                    emailClient.AuthenticationMechanisms.Remove("XOAUTH2");
                    emailClient.Authenticate(SmtpUsername, SmtpPassword);
                    emailClient.Send(message);
                    emailClient.Disconnect(true);
                }
                UpdateAsComplete(emailMessage);
            }
            catch (Exception e)
            {
                UpdateAsFailed(emailMessage, e);
            }
        }
    }
}

	

