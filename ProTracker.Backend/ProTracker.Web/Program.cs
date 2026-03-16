using ProTracker.Web;

var builder = WebApplication.CreateBuilder(args);
builder.AddAppServices();

var app = builder.Build();

await app.ApplyDatabaseMigrations();
app.ConfigureApplication();

await app.RunAsync();
