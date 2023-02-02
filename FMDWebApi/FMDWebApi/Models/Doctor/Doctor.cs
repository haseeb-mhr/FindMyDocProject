using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMDWebApi.Models.Doctor
{
    public class Doctor
    {
        public User User { get; set; }
        public IQueryable<DoctorLocation> DoctorLocations  { get; set; }
        public IQueryable<DoctorQualification> DoctorQualifications { get; set; }
        public IQueryable<DoctorSpecialization> DoctorSpecializations { get; set; }
    }
}