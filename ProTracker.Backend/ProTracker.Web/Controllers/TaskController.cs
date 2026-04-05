using Microsoft.AspNetCore.Mvc;
using ProTracker.Interfaces;
using ProTracker.Web.Contracts;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/task")]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly IGoalService _goalService;

    public TaskController(ITaskService taskService, IGoalService goalService)
    {
        _taskService = taskService ?? throw new ArgumentNullException(nameof(taskService));
        _goalService = goalService ?? throw new ArgumentNullException(nameof(goalService));
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTasks()
    {
        var tasks = await _taskService.GetAllTasksAsync();
        var result = tasks.Select(t => t.ToContract());
        return Ok(result);
    }

    /// <summary>
    /// Creates a new task and associated goal if it doesn't exist.
    /// </summary>
    /// <param name="createRequest">The new task details.</param>
    /// <returns>The created task, log, and goal.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateTask(TaskCreateRequest createRequest)
    {
        createRequest.Title = createRequest.Title.Trim();
        if (string.IsNullOrWhiteSpace(createRequest.Title))
        { 
            return BadRequest("Title is required.");
        }

        var taskModel = new Models.Task
        {
            Title = createRequest.Title,
            TaskStatus = Models.TaskStatus.Pending,
            CreatedOn = createRequest.CreatedOn,
            CompleteBy = createRequest.CompleteBy,
        };

        var createdTask = createRequest.GoalId.HasValue
            ? await _taskService.CreateTaskAsync(taskModel, createRequest.GoalId.Value)
            : await _taskService.CreateTaskAsync(taskModel);

        var response = createdTask.ToContract();
        return Ok(response);
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
        task.Title = task.Title.Trim();
        if (string.IsNullOrWhiteSpace(task.Title))
        {
            return BadRequest("Title is required.");
        }

        if (task.GoalId.HasValue)
        {
            var goal = await _goalService.GetGoalByIdAsync(task.GoalId.Value);
            if (goal == null)
            {
                return NotFound($"Goal with ID {task.GoalId} not found.");
            }
        }

        var success = await _taskService.UpdateTaskAsync(id, task.Title, task.GoalId);
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
        var log = await _taskService.ToggleTaskStatusAsync(toggleRequest.TaskId, toggleRequest.Status.ToModel(), toggleRequest.Time);
        return Ok(log.TaskStatus);
    }

    /// <summary>
    /// Deletes a task by its ID.
    /// </summary>
    /// <param name="id">The ID of the task to delete.</param>
    /// <returns>True if the task was successfully deleted, otherwise False.</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var success = await _taskService.DeleteTaskAsync(id);
        if (!success) return NotFound();

        return Ok(true);
    }
}
