using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Api.WebData.Store.Background
{
    public class StoreBackgroundService : IHostedService, IDisposable
    {
        private readonly ILogger<StoreBackgroundService> _logger;
        private Timer _timer;
        public StoreBackgroundService(DataStoreProvider provider, ILogger<StoreBackgroundService> logger)
        {
            Provider = provider;
            _logger = logger;
        }

        public DataStoreProvider Provider { get; }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero,
                TimeSpan.FromMinutes(1));
            
            return Task.CompletedTask;
        }
        private void DoWork(object state)
        {
            this.Provider.Flush();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            this.Provider.Flush();
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
