namespace ProTracker.Web.Contracts;

public record TaskCreateResponse
{
    public int Id { get; set; }
    public int? GoalId { get; set; }
    public required string Title { get; set; }
    public TaskStatus TaskStatus { get; set; }
    
    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? CompletedOn { get; set; }
}
