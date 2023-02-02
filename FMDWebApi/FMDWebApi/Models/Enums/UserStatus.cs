using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FMDWebApi.Models.Enums
{
    public enum UserStatus
    {
        UserExists,
        InvalidUser,
        UserRegistered,
        EmailNotInUse,
        EmailExists,
        PasswordExists,
        InvalidPasword,
        None
    }
}