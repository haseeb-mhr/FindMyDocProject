using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FMDWebApi.Common.Services
{
    public interface IEmailAlertQueue
    {
        Task ExecuteAsync(CancellationToken stoppingToken);
    }
}
