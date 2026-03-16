namespace ProTracker.Models;

public class Schedule
{
    public ScheduleType Type { get; set; }
    public int RequiredTimes { get; set; }
    public int? DaysOfWeek { get; set; }

    public DateTimeOffset StartedAt { get; set; }
    public DateTimeOffset? EndedAt { get; set; }
}