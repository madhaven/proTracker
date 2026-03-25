namespace ProTracker.Web.Contracts;

public record GoalCreateResponse
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset? DateTarget { get; set; }
    public DateTimeOffset? DateCompleted { get; set; }
}
