using Microsoft.EntityFrameworkCore;
using WeatherDashboard.Api.Models;

namespace WeatherDashboard.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<City> Cities => Set<City>();
    public DbSet<WeatherSnapshot> WeatherSnapshots => Set<WeatherSnapshot>();
    public DbSet<SearchLog> SearchLogs => Set<SearchLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<City>()
            .HasIndex(c => new { c.Name, c.Country });

        modelBuilder.Entity<WeatherSnapshot>()
            .HasOne(ws => ws.City)
            .WithMany(c => c.WeatherSnapshots)
            .HasForeignKey(ws => ws.CityId);

        modelBuilder.Entity<SearchLog>()
            .HasOne(sl => sl.City)
            .WithMany(c => c.SearchLogs)
            .HasForeignKey(sl => sl.CityId);
    }
}