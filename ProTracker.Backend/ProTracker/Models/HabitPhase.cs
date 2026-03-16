namespace ProTracker.Models;

public class HabitPhase
{
    public int Id { get; set; }
    public Habit Habit { get; set; }
    public required Schedule Schedule { get; set; }
}