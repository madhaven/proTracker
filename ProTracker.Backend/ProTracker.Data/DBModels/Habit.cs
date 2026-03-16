using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTracker.Data.DBModels;

[Table("Habits")]
public class Habit
{
    [Key] public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public HabitPhase[] Phases = [];
    public IEnumerable<string> Promoters { get; set; }
    public IEnumerable<string> Demoters { get; set; }

    public DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset DateCompleted { get; set; }
}