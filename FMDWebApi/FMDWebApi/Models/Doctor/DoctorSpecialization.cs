using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FMDWebApi.Models.Doctor
{
    public class DoctorSpecialization
    {
        [Key]
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public string Specialization { get; set; }
        public string Experience { get; set; }
        public string AdditonalDetails { get; set; }
    }
}
