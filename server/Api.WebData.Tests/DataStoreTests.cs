using Api.WebData.Store;
using FluentAssertions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Api.WebData.Tests
{
    public class DataStoreTests
    {
        [Fact]
        public async Task StoreUpdateTest()
        {
            var baseDir = System.IO.Path.GetTempPath();
            using var store = new DataStore(baseDir, "unit-test");
            var set = store.Set<Model>();

            var model1 = new Model { Property = 1 };
            var model2 = new Model { Property = 100 };
            var (id, version) = set.Add(new[] { model1, model2 }).First();
            var previous = await set.UpdateAsync(id, version, new Model
            {
                Property = 2
            });

            previous.Property.Should().Be(1);

            store.Clear();
        }
    }

    class Model
    {
        public int Property { get; set; }
    }
}
