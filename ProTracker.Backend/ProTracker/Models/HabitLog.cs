namespace ProTracker.Models;

public class HabitLog
{
    public int Id { get; set; }
    public required Habit Habit { get; set; }
    public DateTimeOffset LogTime { get; set; }
}
