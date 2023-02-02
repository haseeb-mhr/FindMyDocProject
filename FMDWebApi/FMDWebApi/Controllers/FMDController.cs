using FMDWebApi.Common.Services;
using FMDWebApi.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FMDWebApi.Controllers
{
    [ApiController]
    public class FMDController : ControllerBase
    {
        protected readonly FMDDbContext _dbContext;
        protected readonly IAlert _alert;
        public FMDController(FMDDbContext dbContext, IAlert alert)
        {
            _dbContext = dbContext;
            _alert = alert;
        }

        internal void Dispose(bool disposing)
        { 
            if (disposing)
            {
                _dbContext.Dispose();
            }
        }
    }
}
