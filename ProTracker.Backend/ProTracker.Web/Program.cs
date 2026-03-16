using ProTracker.Web;

var builder = WebApplication.CreateBuilder(args);
builder.SetupSqliteDb();
builder.PluginDependencies();

var app = builder.Build();
await app.ApplyDatabaseMigrations();
app.ConfigureAppPipe();

await app.RunAsync();
