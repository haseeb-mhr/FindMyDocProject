using FMDWebApi.Common.AlertModels;
using FMDWebApi.Common.Services;
using FMDWebApi.DAL;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace FMDWebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // https://www.infoworld.com/article/3327562/how-to-enable-cors-in-aspnet-core.html
            // https://www.youtube.com/watch?v=S5dzfuh3t8U

            services.AddDbContext<FMDDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("DevConnection"));
            });
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

            services.Configure<FormOptions>(o => {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            services.AddControllers();
            services.Configure<ResetPasswordPath>(Configuration.GetSection("ResetPassword"));
            services.AddHostedService<EmailAlertBackgroundService>();
            services.AddSingleton<EmailAlertQueue>(); // We must explicitly register EmailAlertQueue
            services.AddSingleton<IEmailAlertQueue>(x => x.GetRequiredService<EmailAlertQueue>()); // Forward requests to EmailAlertQueue
            services.AddSingleton<IAlert>(x => x.GetRequiredService<EmailAlertQueue>()); // Forward requests to EmailAlertQueue
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /*
            app.UseCors(options =>
            options.WithOrigins("http://localhost:300", "http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
            */

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("CorsPolicy");
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
