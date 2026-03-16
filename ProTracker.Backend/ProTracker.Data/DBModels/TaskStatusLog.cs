using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProTracker.Data.DBModels;

[Table("TaskStatusLogs")]
public class TaskStatusLog
{
    [Key] public int Id { get; set; }
    public int TaskId { get; set; }
    public Task Task { get; set; }
    public TaskStatus Status { get; set; }
    public DateTimeOffset LogTime { get; set; }
}