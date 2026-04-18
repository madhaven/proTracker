using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Interfaces;
using ProTracker.Models;
using Task = ProTracker.Models.Task;
using TaskStatus = ProTracker.Models.TaskStatus;

namespace ProTracker.Implementation.Services;

public class TaskService : ITaskService
{
    private readonly ProTrackerDbContext _context;
    private readonly IGoalService _goalService;

    public TaskService(ProTrackerDbContext context, IGoalService goalService)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _goalService = goalService ?? throw new ArgumentNullException(nameof(goalService));
    }

    public async Task<IEnumerable<Task>> GetAllTasksAsync()
    {
        var tasks = await _context.Tasks
            .Include(t => t.Goal)
            .Select(t => t.ToModel())
            .ToListAsync();
        return tasks;
    }

    public async Task<Task> CreateTaskAsync(Task task)
    {
        var dbTask = task.ToDbModel();
        _context.Tasks.Add(dbTask);
        _context.TaskStatusLogs.Add(new Data.DBModels.TaskStatusLog
        {
            LogTime = task.CreatedOn,
            Status = Data.DBModels.TaskStatus.Pending,
            Task = dbTask,
            TaskId =  dbTask.Id
        });
        await _context.SaveChangesAsync();

        task.Id = dbTask.Id;
        return task;
    }

    public async Task<Task> CreateTaskAsync(Task task, int goalId)
    {
        var goal = await _goalService.GetGoalByIdAsync(goalId)
            ?? throw new InvalidOperationException("Goal not found");

        task.Priority = CalculateTaskPriority(task);
        var dbTask = task.ToDbModel();
        dbTask.GoalId = goalId;

        _context.Tasks.Add(dbTask);
        _context.TaskStatusLogs.Add(new Data.DBModels.TaskStatusLog
        {
            LogTime = task.CreatedOn,
            Status = Data.DBModels.TaskStatus.Pending,
            Task = dbTask,
            TaskId = dbTask.Id
        });
        await _context.SaveChangesAsync();

        task.Id = dbTask.Id;
        task.Goal = goal;
        return task;
    }

    public async Task<bool> UpdateTaskAsync(Task task)
    {
        var existingTask = await _context.Tasks.FindAsync(task.Id);
        if (existingTask == null) return false;

        existingTask.Title = task.Title;
        existingTask.GoalId = task.Goal?.Id;
        // existingTask.Status = task.TaskStatus.ToDbModel();
        existingTask.Priority = CalculateTaskPriority(existingTask.ToModel());
        existingTask.CompleteBy = task.CompleteBy;
        existingTask.CompletedOn = task.CompletedOn;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<TaskStatusLog> ToggleTaskStatusAsync(int taskId, TaskStatus status, DateTimeOffset time)
    {
        var dbTask = await _context.Tasks
            .Include(t => t.Goal)
            .Where(t => t.Id == taskId).FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Task not found");

        var dbLog = new Data.DBModels.TaskStatusLog
        {
            LogTime = time,
            Status = status.ToDbModel(),
            Task = dbTask,
        };

        _context.TaskStatusLogs.Add(dbLog);
        dbTask.Status = status.ToDbModel();
        dbTask.CompletedOn = status == TaskStatus.Completed ? time : null;

        await _context.SaveChangesAsync();
        return dbLog.ToModel();
    }

    public async Task<IEnumerable<TaskStatusLog>> GetAllTaskStatusLogsAsync()
    {
        var dbLogs = await _context.TaskStatusLogs
            .Include(l => l.Task)
            .ThenInclude(t => t.Goal)
            .Select(l => l.ToModel())
            .ToListAsync();
        return dbLogs;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }

    public int CalculateTaskPriority(Task task)
    {
        // TODO: add UI control on weights, simulation with a scenario of tasks.
        // TODO: add weighted priority when `task` is a blocker
        const int tttWeight = 1;
        const int ageWeight = 10;
        const int overdueWeight = 100;
        const int freeTaskBias = 10_000;
        var priority = 0;
        var now = DateTimeOffset.UtcNow;

        if (task.TaskStatus == TaskStatus.Completed)
        {
            // push older tasks back by a factor of age
            var completionProximity = (int)(now - task.CompletedOn!.Value).TotalHours;
            priority += completionProximity * ageWeight;
            return priority;
        }

        var age = (int)(now - task.CreatedOn).TotalHours;
        if (task.CompleteBy == null)
        {
            // give priority to age since no deadline
            priority += freeTaskBias - age * ageWeight;
        }
        else
        {
            // consider deadline as priority, giving importance to age
            var timeToTarget = (int)(task.CompleteBy.Value - now).TotalHours;
            var weight = timeToTarget < 0 ? overdueWeight : tttWeight;
            priority += timeToTarget * weight - age * ageWeight;
        }
        
        return priority;
    }
}
