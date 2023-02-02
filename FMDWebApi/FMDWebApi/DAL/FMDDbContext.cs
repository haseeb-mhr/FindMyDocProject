using FMDWebApi.Common.AlertModels;
using FMDWebApi.Models;
using FMDWebApi.Models.Doctor;
using Microsoft.EntityFrameworkCore;

namespace FMDWebApi.DAL
{
    public class FMDDbContext : DbContext
    {
        public FMDDbContext(DbContextOptions<FMDDbContext> options)
        : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        public DbSet<User> Users { get; set; }

        public DbSet<DoctorLocation> DoctorLocations { get; set; }
        public DbSet<DoctorQualification> DoctorQualifications { get; set; }
        public DbSet<DoctorSpecialization> DoctorSpecializations { get; set; }

        public DbSet<EmailAlert> EmailAlerts { get; set; }

        public DbSet<Setting> Settings { get; set; }

        public DbSet<EmailQueueEntry> EmailQueueEntrys { get; set; }

        public DbSet<CacheObject> CacheObjects { get; set; }

    }
}
