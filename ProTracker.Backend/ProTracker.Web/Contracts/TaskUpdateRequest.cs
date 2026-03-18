namespace ProTracker.Web.Contracts;

public record TaskUpdateRequest
{
    public required string Title { get; set; }
    public TaskStatus Status { get; set; }
    public int? GoalId { get; set; }
}