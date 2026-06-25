using Microsoft.EntityFrameworkCore;

namespace WebApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<Analysis> Analyses => Set<Analysis>();
    public DbSet<Note> Notes => Set<Note>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Role).HasConversion<string>();
        });

        modelBuilder.Entity<Contract>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Status).HasConversion<string>();
            e.HasIndex(c => c.OwnerUserId); // owner-scoped queries
        });

        modelBuilder.Entity<Analysis>(e =>
        {
            e.HasKey(a => a.Id);
            e.HasIndex(a => a.ContractId); // fast lookup by contract
        });

        modelBuilder.Entity<Note>(e =>
        {
            e.HasKey(n => n.Id);
            e.HasIndex(n => n.ContractId); // fast lookup by contract
        });
    }
}
