using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Get DB Path from configuration or default
var dbPath = builder.Configuration.GetValue<string>("DatabasePath") ?? "proTracker.db";
builder.Services.AddDbContext<ProTrackerDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

var app = builder.Build();

// Automatically create database if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ProTrackerDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => 
    {
        options.WithTitle("ProTracker API")
               .WithTheme(ScalarTheme.Purple)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
    
    // Redirect root to Scalar UI for convenience
    app.MapGet("/api-docs", () => Results.Redirect("/scalar/v1"));
}

app.UseHttpsRedirection();

// Serve static files from wwwroot
app.UseStaticFiles(); 

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

// Handle Angular routing
app.MapFallbackToFile("index.html");

app.Run();
