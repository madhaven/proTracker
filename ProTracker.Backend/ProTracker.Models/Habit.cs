namespace ProTracker.Models;

public class Habit
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Removed { get; set; }
    public long StartTime { get; set; }
    public long? EndTime { get; set; }
    public int Days { get; set; }

    // Navigation properties
    public ICollection<HabitLog> HabitLogs { get; set; } = new List<HabitLog>();
}
