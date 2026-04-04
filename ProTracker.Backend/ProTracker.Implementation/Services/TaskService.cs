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

    public async Task<bool> UpdateTaskAsync(int id, string title, int? goalId)
    {
        var existingTask = await _context.Tasks.FindAsync(id);
        if (existingTask == null) return false;

        existingTask.Title = title;
        existingTask.GoalId = goalId;
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
        if (status == TaskStatus.Completed)
        {
            dbTask.CompletedOn = time;
        }

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
}
