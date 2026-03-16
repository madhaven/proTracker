using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Implementation;
using ProTracker.Web.Contracts;
using ProTracker.Models;
using Goal = ProTracker.Data.DBModels.Goal;
using TaskStatus = ProTracker.Models.TaskStatus;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/task")]
internal class TaskController : ControllerBase
{
    private readonly ProTrackerDbContext _context;

    public TaskController(ProTrackerDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    /// <summary>
    /// Creates a new task and associated goal if it doesn't exist.
    /// </summary>
    /// <param name="taskCreate">The new task details.</param>
    /// <returns>The created task, log, and goal.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateTask(TaskCreateRequest taskCreate)
    {
        var goal = await _context.Goals.FirstOrDefaultAsync(p => p.Title == taskCreate.Project.Trim());
        if (goal == null)
        {
            goal = new Goal { Title = taskCreate.Project.Trim() };
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
        }

        var task = new Models.Task
        {
            Goal = goal.ToModel(),
            Title = taskCreate.Title.Trim(),
            TaskStatus = TaskStatus.Pending
        };
        _context.Tasks.Add(task.ToDbModel());
        await _context.SaveChangesAsync();

        var log = new TaskStatusLog
        {
            TaskStatus = TaskStatus.Pending,
            Task = task,
            LogTime = taskCreate.DateTimeCreated,
        };
        _context.TaskStatusLogs.Add(log.ToDbModel());
        await _context.SaveChangesAsync();

        return Ok(new
        {
            task,
            log,
            project = goal
        });
    }

    /// <summary>
    /// Updates an existing task's summary.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="task">The task to update.</param>
    /// <returns>True if successful.</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTask(int id, TaskUpdateRequest task)
    {
        var existingTask = await _context.Tasks.FindAsync(id);
        if (existingTask == null) return NotFound();

        existingTask.Title = task.Title;
        await _context.SaveChangesAsync();

        return Ok(true);
    }

    /// <summary>
    /// Toggles the status of a task by adding a new status log.
    /// </summary>
    /// <param name="toggleRequest">The task ID and new status.</param>
    /// <returns>The newly created status log.</returns>
    [HttpPut("toggle")]
    public async Task<IActionResult> ToggleTask(TaskToggleRequest toggleRequest)
    {
        var task = await _context.Tasks.FindAsync(toggleRequest.TaskId) ?? throw new InvalidOperationException();
        var log = new TaskStatusLog
        {
            TaskStatus = toggleRequest.Status.ToModel(),
            Task = task.ToModel(),
        };
        _context.TaskStatusLogs.Add(log.ToDbModel());
        await _context.SaveChangesAsync();

        return Ok(log);
    }
}