using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using Scalar.AspNetCore;

namespace ProTracker.Web;

public static class StartupHelper
{
    public static void SetupSqliteDb(this WebApplicationBuilder builder)
    {
        var dataDir = Path.Combine(builder.Environment.ContentRootPath, "Data");
        Directory.CreateDirectory(dataDir); // ensures folder exists

        // Get DB Path from configuration or default
        var dbPath = builder.Configuration.GetValue<string>("DatabasePath")
            ?? Path.Combine(dataDir, "protracker.db");

        builder.Services.AddDbContext<ProTrackerDbContext>(options =>
            options.UseSqlite($"Data Source={dbPath}"));
    }

    public static void PluginDependencies(this WebApplicationBuilder builder)
    {
        builder.Services.InvertDependencies();
        builder.Services.AddControllers();
        builder.Services.AddApiDocumentation();

        // Dev Functionality
        if (!builder.Environment.IsDevelopment()) return;
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
    }
    
    /// <summary>
    /// Automatically creates database if it doesn't exist and performs pending migrations on data
    /// </summary>
    /// <param name="app">Web Application</param>
    public static async Task ApplyDatabaseMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ProTrackerDbContext>();
        await context.Database.MigrateAsync();
    }

    /// <summary>
    /// Configure the HTTP request pipeline.
    /// </summary>
    /// <param name="app">Web Application</param>
    public static void ConfigureAppPipe(this WebApplication app)
    {
        app.UseDevFeatures();

        app.UseHttpsRedirection();

        app.UseStaticFiles();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.Map("api/{**slug}", () => Results.NotFound());
        app.MapFallbackToFile("index.csr.html"); // Handle Angular routing
    }

    private static void InvertDependencies(this IServiceCollection services)
    {
        services.AddScoped<Interfaces.IGoalService, Implementation.Services.GoalService>();
        services.AddScoped<Interfaces.IHabitService, Implementation.Services.HabitService>();
        services.AddScoped<Interfaces.ITaskService, Implementation.Services.TaskService>();
    }
    
    private static void AddApiDocumentation(this IServiceCollection services)
    {
        services.AddOpenApi();
        services.AddEndpointsApiExplorer();
    }

    private static void UseDevFeatures(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment()) return;

        app.UseCors("AllowAll");
        
        app.MapOpenApi();
        app.MapScalarApiReference(options => 
        {
            options.WithTitle("ProTracker API")
                .WithTheme(ScalarTheme.Moon)
                .WithDefaultHttpClient(
                    ScalarTarget.CSharp,
                    ScalarClient.HttpClient);
        });

        // Redirect root to Scalar UI for convenience
        // TODO: Load from config
        app.MapGet("/api", () => Results.Redirect("/scalar/v1"));
    }
}