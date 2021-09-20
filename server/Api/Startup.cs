using Api.Controllers;
using Api.Data;
using Api.Data.EFCore;
using Api.WebData.Store;
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
            services.AddSingleton(new DataStoreProvider(Configuration["DATA_DIR"] ?? Environment.GetEnvironmentVariable("DATA_DIR") ?? "webdata"));

            // Add framework services.
            services.AddDbContext<RomDbContext>(options => {
                options.UseSqlServer("server=.;database=rom;Integrated Security=SSPI;MultipleActiveResultSets=True");
                options.LogTo(Console.WriteLine);
                });

            services.RegisterDbSetRepositories<RomDbContext>();
            services.AddHostedService<WebData.Store.Background.StoreBackgroundService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime applicationLifetime)
        {
            applicationLifetime.ApplicationStopping.Register(() =>
            {
                app.ApplicationServices.GetRequiredService<DataStoreProvider>().Flush();
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebSockets();
            }

            app.UseHttpsRedirection();

            var dist = Path.GetFullPath(Path.Combine(env.ContentRootPath, "../../dist"));

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
                if (env.IsDevelopment())
                {
                    endpoints.MapHub<Development.WatchHub>("/watch");
                }
            });

            UseSpaDefaults(app, distFileProvider);
        }

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
