using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FMDWebApi.Models.Doctor
{
    public class DoctorLocation
    {
        [Key]
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public string Address { get; set; }
        public decimal LocationX { get; set; }
        public decimal LocationY { get; set; }
        public string OpeningTime { get; set; }
        public string ClosingTime { get; set; }
        public string Fee { get; set; }
    }
}