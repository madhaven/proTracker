namespace ProTracker.Models;

public class TrackerTask
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Summary { get; set; } = string.Empty;
    public int? ParentId { get; set; }

    // Navigation properties
    public Goal Goal { get; set; } = null!;
    public TrackerTask? Parent { get; set; }
    public ICollection<TrackerTask> Children { get; set; } = new List<TrackerTask>();
    public ICollection<StatusLog> StatusLogs { get; set; } = new List<StatusLog>();
}
