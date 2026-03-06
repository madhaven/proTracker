namespace ProTracker.Models;

public class StatusLog
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int StatusId { get; set; }
    public long DateTime { get; set; }

    // Navigation properties
    public TrackerTask Task { get; set; } = null!;
    public Status Status { get; set; } = null!;
}
