using DBModels = ProTracker.Data.DBModels;

namespace ProTracker.Implementation;

public static class Converters
{
    public static DBModels.Goal ToDbModel(this Models.Goal goal)
    {
        return new DBModels.Goal
        {
            Id = goal.Id,
            Title = goal.Title,
            DateAdded = goal.DateAdded,
            DateCompleted = goal.DateCompleted,
            DateTarget = goal.DateTarget,
        };
    }

    public static DBModels.Habit ToDbModel(this Models.Habit habit)
    {
        return new DBModels.Habit
        {
            Id = habit.Id,
            Title = habit.Title,
            Description = habit.Description,
            Phases = habit.Phases.Select(ToDbModel).ToArray(),
            Demoters = habit.Demoters,
            Promoters = habit.Promoters,
            DateAdded = habit.DateAdded,
            DateCompleted = habit.DateCompleted,
        };
    }

    public static DBModels.HabitLog ToDbModel(this Models.HabitLog log)
    {
        return new DBModels.HabitLog
        {
            Id = log.Id,
            HabitId = log.Habit.Id,
            Habit = log.Habit.ToDbModel(),
            LogTime = log.LogTime,
        };
    }

    public static DBModels.HabitPhase ToDbModel(this Models.HabitPhase habitPhase)
    {
        return new DBModels.HabitPhase
        {
            Id = habitPhase.Id,
            HabitId = habitPhase.Habit.Id,
            Habit = habitPhase.Habit.ToDbModel(),
            Type = habitPhase.Schedule.Type.ToDbModel(),
            DaysOfWeek = habitPhase.Schedule.DaysOfWeek,
            RequiredTimes = habitPhase.Schedule.RequiredTimes,
            StartedAt = habitPhase.Schedule.StartedAt,
            EndedAt = habitPhase.Schedule.EndedAt,
        };
    }

    public static DBModels.ScheduleType ToDbModel(this Models.ScheduleType type)
    {
        return type switch
        {
            Models.ScheduleType.Daily => DBModels.ScheduleType.Daily,
            Models.ScheduleType.Weekly => DBModels.ScheduleType.Weekly,
            Models.ScheduleType.Monthly => DBModels.ScheduleType.Monthly,
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };
    }

    public static DBModels.Task ToDbModel(this Models.Task task)
    {
        return new DBModels.Task
        {
            Id = task.Id,
            Title = task.Title,
            Status = task.TaskStatus.ToDbModel(),
            GoalId = task.Goal?.Id ?? 0,
            Goal = task.Goal?.ToDbModel()!,
        };
    }

    public static DBModels.TaskStatus ToDbModel(this Models.TaskStatus taskStatus)
    {
        return taskStatus switch
        {
            Models.TaskStatus.Pending => DBModels.TaskStatus.Pending,
            Models.TaskStatus.InProgress => DBModels.TaskStatus.InProgress,
            Models.TaskStatus.NeedInfo => DBModels.TaskStatus.NeedInfo,
            Models.TaskStatus.Completed => DBModels.TaskStatus.Completed,
            Models.TaskStatus.Waiting => DBModels.TaskStatus.Waiting,
            Models.TaskStatus.Cancelled => DBModels.TaskStatus.Cancelled,
            _ => throw new ArgumentOutOfRangeException(nameof(taskStatus), taskStatus, null)
        };
    }

    public static DBModels.TaskStatusLog ToDbModel(this Models.TaskStatusLog log)
    {
        return new DBModels.TaskStatusLog
        {
            Id = log.Id,
            TaskId = log.Task.Id,
            Task = log.Task.ToDbModel(),
            Status = log.TaskStatus.ToDbModel(),
            LogTime = DateTimeOffset.FromUnixTimeMilliseconds(log.LogTime),
        };
    }

    public static Models.Goal ToModel(this DBModels.Goal goal)
    {
        return new Models.Goal
        {
            Id = goal.Id,
            Title = goal.Title,
            DateAdded = goal.DateAdded,
            DateCompleted = goal.DateCompleted,
            DateTarget = goal.DateTarget,
        };
    }

    public static Models.Habit ToModel(this DBModels.Habit habit)
    {
        return new Models.Habit
        {
            Id = habit.Id,
            Title = habit.Title,
            Description = habit.Description,
            Phases = habit.Phases.Select(x => x.ToModel()),
            Demoters = habit.Demoters,
            Promoters = habit.Promoters,
            DateAdded = habit.DateAdded,
            DateCompleted = habit.DateCompleted,
        };
    }

    public static Models.HabitLog ToModel(this DBModels.HabitLog log)
    {
        return new Models.HabitLog
        {
            Id = log.Id,
            Habit = log.Habit.ToModel(),
            LogTime = log.LogTime,
        };
    }

    public static Models.HabitPhase ToModel(this DBModels.HabitPhase habitPhase)
    {
        return new Models.HabitPhase
        {
            Id = habitPhase.Id,
            Habit = habitPhase.Habit.ToModel(),
            Schedule = new Models.Schedule
            {
                DaysOfWeek = habitPhase.DaysOfWeek,
                RequiredTimes = habitPhase.RequiredTimes,
                StartedAt = habitPhase.StartedAt,
                EndedAt = habitPhase.EndedAt,
                Type = habitPhase.Type.ToModel(),
            },
        };
    }

    public static Models.ScheduleType ToModel(this DBModels.ScheduleType type)
    {
        return type switch
        {
            DBModels.ScheduleType.Daily => Models.ScheduleType.Daily,
            DBModels.ScheduleType.Weekly => Models.ScheduleType.Weekly,
            DBModels.ScheduleType.Monthly => Models.ScheduleType.Monthly,
            _ =>  throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };
    }

    public static Models.Task ToModel(this DBModels.Task task)
    {
        return new Models.Task
        {
            Id = task.Id,
            Title = task.Title,
            TaskStatus = task.Status.ToModel(),
            Goal = task.Goal?.ToModel(),
        };
    }

    public static Models.TaskStatus ToModel(this DBModels.TaskStatus status)
    {
        return status switch
        {
            DBModels.TaskStatus.Pending => Models.TaskStatus.Pending,
            DBModels.TaskStatus.InProgress => Models.TaskStatus.InProgress,
            DBModels.TaskStatus.NeedInfo => Models.TaskStatus.NeedInfo,
            DBModels.TaskStatus.Completed => Models.TaskStatus.Completed,
            DBModels.TaskStatus.Waiting => Models.TaskStatus.Waiting,
            DBModels.TaskStatus.Cancelled => Models.TaskStatus.Cancelled,
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
        };
    }

    public static Models.TaskStatusLog ToModel(this DBModels.TaskStatusLog log)
    {
        return new Models.TaskStatusLog
        {
            Id = log.Id,
            Task = log.Task.ToModel(),
            TaskStatus = log.Status.ToModel(),
            LogTime = log.LogTime.ToUnixTimeMilliseconds(),
        };
    }
}
