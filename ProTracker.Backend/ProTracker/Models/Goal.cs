namespace ProTracker.Models;

public class Goal
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public IEnumerable<Task> Tasks { get; set; } = new List<Task>();
    
    public required DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset? DateTarget { get; set; }
    public DateTimeOffset? DateCompleted { get; set; }
}
