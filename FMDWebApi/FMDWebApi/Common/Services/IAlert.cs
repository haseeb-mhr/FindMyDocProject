using FMDWebApi.Common.AlertModels;
using FMDWebApi.Models.FrontEnd;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMDWebApi.Common.Services
{
    public interface IAlert
    {
        void RaiseContactUsEmailAlert(ContactUs contactUs);

        void RaiseResetPasswordEmailAlert(ResetPasswordAlert resetPasswordAlert);

        void RaiseEmailVerificationAlert(EmailVerificationAlert emailVerificationAlert);

        void RaiseResetPasswordSuccessEmailAlert(int userId);
    }
}
