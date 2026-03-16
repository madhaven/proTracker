using Microsoft.AspNetCore.Mvc;
using ProTracker.Interfaces;
using ProTracker.Web.Contracts;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/task")]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TaskController(ITaskService taskService)
    {
        _taskService = taskService ?? throw new ArgumentNullException(nameof(taskService));
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllTasks()
    {
        var result = await _taskService.GetAllTasksAsync();
        return Ok(result);
    }

    /// <summary>
    /// Creates a new task and associated goal if it doesn't exist.
    /// </summary>
    /// <param name="taskCreate">The new task details.</param>
    /// <returns>The created task, log, and goal.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateTask(TaskCreateRequest taskCreate)
    {
        var result = await _taskService
            .CreateTaskWithGoalAsync(taskCreate.Title, taskCreate.Project, taskCreate.DateTimeCreated);

        return Ok(new
        {
            task = result.task,
            log = result.log,
            project = result.goal
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
        var success = await _taskService.UpdateTaskTitleAsync(id, task.Title);
        if (!success) return NotFound();

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
        var log = await _taskService.ToggleTaskStatusAsync(toggleRequest.TaskId, toggleRequest.Status.ToModel());
        return Ok(log);
    }
}
