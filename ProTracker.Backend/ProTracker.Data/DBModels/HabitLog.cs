using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTracker.Data.DBModels;

[Table("HabitLogs")]
public class HabitLog
{
    [Key] public int Id { get; set; }
    public int HabitId { get; set; }
    public Habit Habit { get; set; }
    public DateTimeOffset LogTime { get; set; }
}