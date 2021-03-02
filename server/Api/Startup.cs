using Api.Controllers;
using Api.Data;
using Api.Data.EFCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;

namespace Api
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
            services.AddControllers();
            services.AddSignalR();

            // Add framework services.
            services.AddDbContext<RomDbContext>(options => {
                options.UseSqlServer("server=.;database=rom;Integrated Security=SSPI;MultipleActiveResultSets=True");
                options.LogTo(Console.WriteLine);
                });

            services.RegisterDbSetRepositories<RomDbContext>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebSockets();
            }

            app.UseHttpsRedirection();

            var dist = Path.GetFullPath(Path.Combine(env.ContentRootPath, "../../dist"));
            var watcher = new FileSystemWatcher
            {
                IncludeSubdirectories = true,
                Path = dist,
                NotifyFilter = NotifyFilters.CreationTime
                                 | NotifyFilters.LastAccess
                                 | NotifyFilters.LastWrite
                                 | NotifyFilters.FileName
                                 | NotifyFilters.DirectoryName,
                Filter = string.Empty
            };

            watcher.Changed += OnChanged;
            watcher.Created += OnChanged;
            watcher.Deleted += OnChanged;
            watcher.Renamed += OnRenamed;

            watcher.EnableRaisingEvents = true;

            var distFileProvider = new PhysicalFileProvider(dist);
            app.UseStaticFiles(new StaticFileOptions
            {
                ServeUnknownFileTypes = true,
                FileProvider = distFileProvider,
                ContentTypeProvider = new FileExtensionContentTypeProvider()
                {
                    Mappings =
                    {
                        {  ".scss", "text/plain" },
                        {  ".tsx", "text/plain" },
                        {  ".bpmn", "application/xml" }
                    }
                }
            });

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<Development.WatchHub>("/watch");
            });

            UseSpaDefaults(app, distFileProvider);

            void OnChanged(object source, FileSystemEventArgs e)
            {
                // Specify what is done when a file is changed, created, or deleted.
                Console.WriteLine($"File: {e.FullPath} {e.ChangeType}");
                var  hubContext = app.ApplicationServices.GetRequiredService<IHubContext<Development.WatchHub>>();
                hubContext.Clients.All.SendAsync("refresh");
            }
        }
        private static void OnRenamed(object source, RenamedEventArgs e) =>
            // Specify what is done when a file is renamed.
            Console.WriteLine($"File: {e.OldFullPath} renamed to {e.FullPath}");

        static IEnumerable<TAccumulate> Scan<TSource, TAccumulate>(IEnumerable<TSource> source, TAccumulate seed, Func<TAccumulate, TSource, TAccumulate> func)
        {
            yield return seed;
            if (source != null)
            {
                var acc = seed;
                foreach (var s in source)
                {
                    acc = func(acc, s);
                    yield return acc;
                }
            }
        }

        public static IApplicationBuilder UseSpaDefaults(IApplicationBuilder app, IFileProvider fileProvider)
        {
            if (app == null)
                return null;

            return app.Use(next => ctx =>
            {
                var parts = ctx.Request.PathBase.Value.Split('/', StringSplitOptions.RemoveEmptyEntries);
                var pathBases = Scan(parts, Enumerable.Empty<string>(), (acc, p) => acc.Append(p));

                foreach (var pathBase in pathBases.Reverse())
                {
                    var fileInfo = fileProvider.GetFileInfo("/" + String.Join("/", pathBase.Append("index.html")));
                    if (fileInfo.Exists)
                    {
                        return ctx.Response.SendFileAsync(fileInfo);
                    }
                }
                return next(ctx);
            });
        }
    }


}
