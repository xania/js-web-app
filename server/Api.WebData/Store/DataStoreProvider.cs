using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Api.WebData.Store
{
    public class DataStoreProvider
    {
        private readonly string dataDir;

        public DataStoreProvider(string dataDir)
        {
            if (dataDir != null)
                Directory.CreateDirectory(dataDir);

            this.dataDir = Path.GetFullPath(dataDir);
        }

        private static readonly IDictionary<string, object> _fileLocks = new Dictionary<string, object>();
        private readonly IDictionary<string, DataStore> _collections = new Dictionary<string, DataStore>();

        public void Clear()
        {
            lock (_collections)
            {
                if (Directory.Exists(this.dataDir))
                    Directory.Delete(this.dataDir, true);

                _collections.Clear();
            }
        }

        public DataStore Get(string path)
        {
            var uid = string.Intern(Path.Combine(dataDir, path));
            lock (_collections)
            {
                var _fileLock = _fileLocks.TryGetValue(uid, out var o) ? o : new object();

                if (_collections.TryGetValue(uid, out var col))
                    return col;

                var file = new FileInfo(uid);
                _collections.Add(uid, col = new DataStore(file.Directory.FullName, file.Name));

                return col;
            }
        }

        public void Flush()
        {
            lock(_collections)
            {
                foreach(var store in _collections.Values)
                {
                    store.Flush();
                }
            }
        }

        public IEnumerable<string> GetFiles(string path)
        {
            var filesDir = new DirectoryInfo(Path.Combine(this.dataDir, path, "__files"));
            if (filesDir.Exists)
            {
                return filesDir.GetFiles().Select(e => e.Name);
            }
            else
            {
                return Enumerable.Empty<string>();
            }
        }

    }
}
