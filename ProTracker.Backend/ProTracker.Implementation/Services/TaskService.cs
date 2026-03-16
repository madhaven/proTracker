using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Interfaces;
using ProTracker.Models;
using Goal = ProTracker.Models.Goal;
using Task = ProTracker.Models.Task;
using TaskStatus = ProTracker.Models.TaskStatus;

namespace ProTracker.Implementation.Services;

public class TaskService : ITaskService
{
    private readonly ProTrackerDbContext _context;

    public TaskService(ProTrackerDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<Task>> GetAllTasksAsync()
    {
        var tasks = await _context.Tasks
            .Include(t => t.Goal)
            .Select(t => t.ToModel())
            .ToListAsync();
        return tasks;
    }

    public async Task<(Task task, TaskStatusLog log, Goal goal)> CreateTaskWithGoalAsync(string title, string project, long dateTimeCreated)
    {
        var dbGoal = await _context.Goals
            .FirstOrDefaultAsync(p => p.Title == project.Trim());
        if (dbGoal == null)
        {
            dbGoal = new Data.DBModels.Goal { Title = project.Trim() };
            _context.Goals.Add(dbGoal);
            await _context.SaveChangesAsync();
        }

        var task = new Task
        {
            Goal = dbGoal.ToModel(),
            Title = title.Trim(),
            TaskStatus = TaskStatus.Pending
        };
        var dbTask = task.ToDbModel();
        _context.Tasks.Add(dbTask);
        await _context.SaveChangesAsync();
        
        // Update task with generated ID
        task = dbTask.ToModel();

        var log = new TaskStatusLog
        {
            TaskStatus = TaskStatus.Pending,
            Task = task,
            LogTime = dateTimeCreated,
        };
        var dbLog = log.ToDbModel();
        _context.TaskStatusLogs.Add(dbLog);
        await _context.SaveChangesAsync();

        return (task, dbLog.ToModel(), dbGoal.ToModel());
    }

    public async Task<bool> UpdateTaskTitleAsync(int id, string title)
    {
        var existingTask = await _context.Tasks.FindAsync(id);
        if (existingTask == null) return false;

        existingTask.Title = title;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<TaskStatusLog> ToggleTaskStatusAsync(int taskId, TaskStatus status)
    {
        var dbTask = await _context.Tasks
            .Include(t => t.Goal)
            .FirstOrDefaultAsync(t => t.Id == taskId) ?? throw new InvalidOperationException("Task not found");

        var log = new TaskStatusLog
        {
            TaskStatus = status,
            Task = dbTask.ToModel(),
        };
        var dbLog = log.ToDbModel();

        _context.TaskStatusLogs.Add(dbLog);
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
}
