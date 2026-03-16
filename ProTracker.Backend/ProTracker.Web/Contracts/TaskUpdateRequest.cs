namespace ProTracker.Web.Contracts;

internal record TaskUpdateRequest
{
    public required string Title { get; set; }
    public TaskStatus Status { get; set; }
}