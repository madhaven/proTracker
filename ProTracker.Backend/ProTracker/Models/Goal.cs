namespace ProTracker.Models;

public class Goal
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public IEnumerable<Task> Tasks { get; set; } = new List<Task>();
    
    public DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset DateTarget { get; set; }
    public DateTimeOffset DateCompleted { get; set; }
}
