using Microsoft.EntityFrameworkCore;
using WebApi.Data;

namespace WebApi.Tests.Helpers;

/// <summary>Creates isolated in-memory AppDbContext instances per test.</summary>
internal static class DbHelper
{
    public static AppDbContext CreateDb(string? name = null)
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(name ?? Guid.NewGuid().ToString())
            .Options;
        var db = new AppDbContext(opts);
        db.Database.EnsureCreated();
        return db;
    }
}
