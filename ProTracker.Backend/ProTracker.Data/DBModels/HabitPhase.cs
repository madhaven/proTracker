using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTracker.Data.DBModels;

[Table("HabitPhases")]
public class HabitPhase
{
    [Key] public int Id { get; set; }
    public int HabitId { get; set; }
    public Habit Habit { get; set; }

    public ScheduleType Type { get; set; }
    public int RequiredTimes { get; set; }
    public int? DaysOfWeek { get; set; }

    public DateTimeOffset StartedAt { get; set; }
    public DateTimeOffset? EndedAt { get; set; }
}