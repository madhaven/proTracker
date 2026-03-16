using TaskStatus = ProTracker.Models.TaskStatus;

namespace ProTracker.Web;

public static class Converters
{
    public static TaskStatus ToModel(this Contracts.TaskStatus taskStatus)
    {
        return taskStatus switch
        {
            Contracts.TaskStatus.Pending => TaskStatus.Pending,
            Contracts.TaskStatus.InProgress => TaskStatus.InProgress,
            Contracts.TaskStatus.NeedInfo => TaskStatus.NeedInfo,
            Contracts.TaskStatus.Completed => TaskStatus.Completed,
            Contracts.TaskStatus.Waiting => TaskStatus.Waiting,
            Contracts.TaskStatus.Cancelled => TaskStatus.Cancelled,
            _ => throw new ArgumentOutOfRangeException(nameof(taskStatus), taskStatus, null),
        };
    }
}