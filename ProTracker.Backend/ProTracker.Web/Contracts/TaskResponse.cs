namespace ProTracker.Web.Contracts;

public record TaskResponse
{
    public int Id { get; set; }
    public int? GoalId { get; set; }
    public required string Title { get; set; }
    public TaskStatus TaskStatus { get; set; }
    public int Priority { get; set; }

    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? CompleteBy { get; set; }
    public DateTimeOffset? CompletedOn { get; set; }
}
