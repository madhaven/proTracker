namespace ProTracker.Web.Contracts;

public record TaskToggleRequest
{
    public int TaskId { get; set; }
    public TaskStatus Status { get; set; }
    public DateTimeOffset Time { get; set; }
}