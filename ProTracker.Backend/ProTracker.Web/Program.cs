using ProTracker.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAppServices(builder.Configuration, builder.Environment);

var app = builder.Build();

await app.ApplyDatabaseMigrations();

app.ConfigureApplication();

await app.RunAsync();
