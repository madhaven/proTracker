namespace ProTracker.Web.Contracts;

public record TaskCreateRequest
{
    public int? GoalId { get; set; }
    public required string Title { get; set; }
    public required DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? CompleteBy { get; set; }
}