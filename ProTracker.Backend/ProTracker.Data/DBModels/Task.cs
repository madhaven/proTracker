using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTracker.Data.DBModels;

[Table("Tasks")]
public class Task
{
    [Key] public int Id { get; set; }
    public int? GoalId { get; set; }
    public Goal? Goal { get; set; }
    public string Title { get; set; }
    public TaskStatus Status { get; set; }

    public DateTimeOffset CreatedOn { get; set; }
    public DateTimeOffset? CompleteBy { get; set; }
    public DateTimeOffset? CompletedOn { get; set; }
}