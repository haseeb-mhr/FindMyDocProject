using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FMDWebApi.Models.Doctor
{
    public class DoctorQualification
    {
        [Key]
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public string Qualification { get; set; }
        public string SchoolName { get; set; }
        public string SchoolingPlace { get; set; }
        public string ObtainedMarks { get; set; }
        public DateTime startingDate { get; set; }
        public DateTime endingDate { get; set; }
        public string AdditonalDetails { get; set; }

    }
}
