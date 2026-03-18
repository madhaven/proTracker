namespace ProTracker.Models;

public class TaskStatusLog
{
    public int Id { get; set; }
    public required Task Task { get; set; }
    public TaskStatus TaskStatus { get; set; }
    public DateTimeOffset LogTime { get; set; }
}
