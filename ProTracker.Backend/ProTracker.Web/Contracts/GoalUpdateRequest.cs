namespace ProTracker.Web.Contracts;

internal record GoalUpdateRequest
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    
    public DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset DateTarget { get; set; }
    public DateTimeOffset DateCompleted { get; set; }
}