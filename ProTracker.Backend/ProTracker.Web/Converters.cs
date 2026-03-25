using ProTracker.Web.Contracts;
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

    public static GoalCreateResponse ToContract(this Models.Goal goal)
    {
        return new GoalCreateResponse
        {
            Id = goal.Id,
            Title = goal.Title,
            DateAdded = goal.DateAdded,
            DateTarget = goal.DateTarget,
            DateCompleted = goal.DateCompleted
        };
    }

    public static TaskCreateResponse ToContract(this Models.Task task)
    {
        return new TaskCreateResponse
        {
            Title = task.Title,
            Id = task.Id, // TODO GUID
            GoalId = task.Goal?.Id,
            TaskStatus = task.TaskStatus.ToContract(),
            CreatedOn = task.CreatedOn,
        };
    }

    public static Contracts.TaskStatus ToContract(this TaskStatus taskStatus)
    {
        return taskStatus switch
        {
            TaskStatus.Pending => Contracts.TaskStatus.Pending,
            TaskStatus.InProgress => Contracts.TaskStatus.InProgress,
            TaskStatus.NeedInfo => Contracts.TaskStatus.NeedInfo,
            TaskStatus.Completed => Contracts.TaskStatus.Completed,
            TaskStatus.Waiting => Contracts.TaskStatus.Waiting,
            TaskStatus.Cancelled => Contracts.TaskStatus.Cancelled,
            _ => throw new ArgumentOutOfRangeException(nameof(taskStatus), taskStatus, null),
        };
    }
}