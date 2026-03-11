using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using Scalar.AspNetCore;

namespace ProTracker.Web;

public static class StartupHelper
{
    public static void AddAppServices(this IServiceCollection services, IConfiguration configuration,  IWebHostEnvironment env)
    
    {
        var dataDir = Path.Combine(env.ContentRootPath, "Data");
        Directory.CreateDirectory(dataDir); // ensures folder exists

        // Get DB Path from configuration or default
        var dbPath = configuration.GetValue<string>("DatabasePath")
            ?? Path.Combine(dataDir, "protracker.db");

        services.AddDbContext<ProTrackerDbContext>(options =>
            options.UseSqlite($"Data Source={dbPath}"));

        services.AddControllers();
        services.AddApiDocumentation();
    }

    public static async Task ApplyDatabaseMigrations(this WebApplication app)
    {
        // Automatically create database if it doesn't exist
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ProTrackerDbContext>();
        await context.Database.MigrateAsync();
    }

    public static void ConfigureApplication(this WebApplication app)
    {
        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperFeatures();
    
            // Redirect root to Scalar UI for convenience
            app.MapGet("/api", () => Results.Redirect("/scalar/v1"));
        }
        
        app.UseHttpsRedirection();

        app.UseStaticFiles();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.MapFallbackToFile("index.html"); // Handle Angular routing
    }
    
    private static void AddApiDocumentation(this IServiceCollection services)
    {
        services.AddOpenApi();
        services.AddEndpointsApiExplorer();
    }

    private static void UseDeveloperFeatures(this WebApplication app)
    {
        app.MapOpenApi();
        app.MapScalarApiReference(options => 
        {
            options.WithTitle("ProTracker API")
                .WithTheme(ScalarTheme.Moon)
                .WithDefaultHttpClient(
                    ScalarTarget.CSharp,
                    ScalarClient.HttpClient);
        });
    }
}