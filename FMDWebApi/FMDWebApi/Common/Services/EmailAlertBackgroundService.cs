using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace FMDWebApi.Common.Services
{
    public class EmailAlertBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        IEmailAlertQueue _queue;
        public EmailAlertBackgroundService(IEmailAlertQueue jobQueue, IServiceScopeFactory serviceScopeFactory)
        {
            _queue = jobQueue;
            _serviceScopeFactory = serviceScopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Log.Information($"EmailAlertBackgroundService is running.{System.Environment.NewLine}");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await _queue.ExecuteAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "Error occurred executing in EmailAlertBackgroundService.");
                }
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            Log.Information("EmailAlertBackgroundService is stopping.");

            await base.StopAsync(cancellationToken);
        }
    }
}
