using FMDWebApi.Models.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FMDWebApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserTitle { get; set; }
        public Genders Gender { get; set; }
        public string PhotoFileName { get; set; }
        public string PhoneNo { get; set; }
        public string Password { get; set; }
        public UserRoles UserRole { get; set; }
    }
}