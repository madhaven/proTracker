namespace ProTracker.Models;

public class Habit
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IEnumerable<HabitPhase> Phases { get; set; } = [];
    public IEnumerable<string> Promoters { get; set; } = [];
    public IEnumerable<string> Demoters { get; set; } = [];

    public DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset DateCompleted { get; set; }
}
