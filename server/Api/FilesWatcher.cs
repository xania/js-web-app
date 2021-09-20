using Api.Development;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Api
{
    internal class FilesWatcher : IHostedService
    {
        private readonly IHostEnvironment env;
        private readonly IHubContext<WatchHub> hub;

        public FilesWatcher(IHostEnvironment env, IHubContext<Development.WatchHub> hub)
        {
            this.env = env;
            this.hub = hub;
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
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
            return Task.CompletedTask;
        }
        void OnChanged(object source, FileSystemEventArgs e)
        {
            // Specify what is done when a file is changed, created, or deleted.
            Console.WriteLine($"File: {e.FullPath} {e.ChangeType}");
            hub.Clients.All.SendAsync("refresh");
        }
        private static void OnRenamed(object source, RenamedEventArgs e) =>
            // Specify what is done when a file is renamed.
            Console.WriteLine($"File: {e.OldFullPath} renamed to {e.FullPath}");

        public Task StopAsync(CancellationToken cancellationToken)
        {
            hub.Clients.All.SendAsync("close");
            return Task.CompletedTask;
        }
    }
}