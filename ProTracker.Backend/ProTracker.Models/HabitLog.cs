namespace ProTracker.Models;

public class HabitLog
{
    public int Id { get; set; }
    public int HabitId { get; set; }
    public long DateTime { get; set; }

    // Navigation properties
    public Habit Habit { get; set; } = null!;
}
