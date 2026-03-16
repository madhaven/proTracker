namespace ProTracker.Web.Contracts;

internal record TaskCreateRequest
{
    public string Project { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public long DateTimeCreated { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    public long DateTimeTarget { get; set; } = (DateTimeOffset.UtcNow + TimeSpan.FromDays(1)).ToUnixTimeMilliseconds();
}