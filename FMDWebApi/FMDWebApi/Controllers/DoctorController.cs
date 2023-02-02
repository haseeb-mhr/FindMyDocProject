using FMDWebApi.Common.AlertModels;
using FMDWebApi.Common.Services;
using FMDWebApi.DAL;
using FMDWebApi.Models;
using FMDWebApi.Models.Doctor;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMDWebApi.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class DoctorController : FMDController
    {
        private readonly CacheObject cacheObject;
        public DoctorController(IAlert alert, FMDDbContext dbContext) : base(dbContext, alert)
        {
            cacheObject = new CacheObject(dbContext);
        }

        [HttpGet("get_all_doctors")]
        public IQueryable<Doctor> GetDoctors()
        {
             var doctors = new List<Doctor>();
            foreach (var user in _dbContext.Users)
            {
                doctors.Add(new Doctor()
                {
                    User = user,
                    DoctorLocations = _dbContext.DoctorLocations.Where(location => location.DoctorId == user.Id),
                    DoctorQualifications = _dbContext.DoctorQualifications.Where(location => location.DoctorId == user.Id),
                    DoctorSpecializations = _dbContext.DoctorSpecializations.Where(location => location.DoctorId == user.Id),
                });
            }
            return doctors.AsQueryable();
        }

        [HttpPut("update_doctor_location")]
        public IActionResult PutDoctorLocation(DoctorLocation doctorLocation)
        {
            if (!UserExists(doctorLocation.DoctorId))
            {
                return NotFound();
            }
            else
            {
                if (DoctorLocationExists(doctorLocation.Id))
                {
                    if (!ModelState.IsValid)
                    {
                        return BadRequest(ModelState);
                    }
                    _dbContext.Entry(doctorLocation).State = EntityState.Modified;
                }
                else
                {
                    _dbContext.DoctorLocations.Add(doctorLocation);
                }
                try
                {
                    _dbContext.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DoctorLocationExists(doctorLocation.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok("Updated");
            }
        }


        [HttpPut("update_doctor_qualification")]
        public IActionResult PutDoctorQualification(DoctorQualification doctorQualification)
        {
            if (!UserExists(doctorQualification.DoctorId))
            {
                return NotFound();
            }
            else
            {
                if (DoctorQualificationExists(doctorQualification.Id))
                {
                    if (!ModelState.IsValid)
                    {
                        return BadRequest(ModelState);
                    }
                    _dbContext.Entry(doctorQualification).State = EntityState.Modified;
                }
                else
                    _dbContext.DoctorQualifications.Add(doctorQualification);

                try
                {
                    _dbContext.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DoctorQualificationExists(doctorQualification.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok("Updated");
            }
        }

        [HttpPut("update_doctor_specialization")]
        public IActionResult PutDoctorSpecialization(DoctorSpecialization doctorSpecialization)
        {
            if (!UserExists(doctorSpecialization.DoctorId))
            {
                return NotFound();
            }
            else
            {
                if (DoctorSpecializationExists(doctorSpecialization.Id))
                {
                    if (!ModelState.IsValid)
                    {
                        return BadRequest(ModelState);
                    }
                    _dbContext.Entry(doctorSpecialization).State = EntityState.Modified;
                }
                else
                    _dbContext.DoctorSpecializations.Add(doctorSpecialization);

                try
                {
                    _dbContext.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DoctorSpecializationExists(doctorSpecialization.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok("Updated");
            }
        }

        private bool DoctorLocationExists(int doctorLocationId)
        {
            return _dbContext.Users.Count(e => e.Id == doctorLocationId) > 0;
        }

        private bool DoctorQualificationExists(int doctorQualificationId)
        {
            return _dbContext.DoctorQualifications.Count(e => e.Id == doctorQualificationId) > 0;
        }

        private bool DoctorSpecializationExists(int doctorSpecializationId)
        {
            return _dbContext.DoctorSpecializations.Count(e => e.Id == doctorSpecializationId) > 0;
        }

        private bool UserExists(int userId)
        {
            return _dbContext.Users.Count(e => e.Id == userId) > 0;
        }
    }

}
