namespace ProTracker.Web.Contracts;

public record GoalCreateRequest
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset DateTarget { get; set; }
}
