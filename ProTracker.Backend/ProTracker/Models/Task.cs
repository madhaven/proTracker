namespace ProTracker.Models;

public class Task
{
    public int Id { get; set; }
    public Goal? Goal { get; set; }
    public required string Title { get; set; }
    public TaskStatus TaskStatus { get; set; }
}
