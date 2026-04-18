using ProTracker.Models;
using ProTracker.Web.Contracts;
using Task = ProTracker.Models.Task;
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

    public static Task ToModel(this Contracts.TaskUpdateRequest taskUpdateRequest, int id, Goal? goal)
    {
        return new Task
        {
            Id = id,
            Title = taskUpdateRequest.Title,
            TaskStatus = taskUpdateRequest.Status.ToModel(),
            Priority = 0,
            CreatedOn = new DateTimeOffset(),
            CompleteBy = taskUpdateRequest.CompleteBy,
            CompletedOn = new DateTimeOffset(),
            Goal = goal
        };
    }

    public static GoalCreateResponse ToContract(this Models.Goal goal)
    {
        return new GoalCreateResponse
        {
            Id = goal.Id,
            Title = goal.Title,
            Description = goal.Description,
            DateAdded = goal.DateAdded,
            DateTarget = goal.DateTarget,
            DateCompleted = goal.DateCompleted
        };
    }

    public static TaskResponse ToContract(this Models.Task task)
    {
        return new TaskResponse
        {
            Title = task.Title,
            Id = task.Id, // TODO GUID
            GoalId = task.Goal?.Id,
            TaskStatus = task.TaskStatus.ToContract(),
            Priority = task.Priority,
            CreatedOn = task.CreatedOn,
            CompleteBy = task.CompleteBy,
            CompletedOn = task.CompletedOn,
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