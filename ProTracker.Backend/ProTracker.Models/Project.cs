namespace ProTracker.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<TrackerTask> Tasks { get; set; } = new List<TrackerTask>();
}
