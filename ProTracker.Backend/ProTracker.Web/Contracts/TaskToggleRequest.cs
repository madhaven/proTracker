namespace ProTracker.Web.Contracts;

internal record TaskToggleRequest
{
    public int TaskId { get; set; }
    public TaskStatus Status { get; set; }
}