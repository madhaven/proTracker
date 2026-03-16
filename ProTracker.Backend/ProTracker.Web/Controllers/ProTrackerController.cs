using Microsoft.AspNetCore.Mvc;
using ProTracker.Interfaces;

namespace ProTracker.Web.Controllers;

/// <summary>
/// Controller for managing goal tracking data, habits, and tasks.
/// </summary>
[ApiController]
[Route("api/pt")]
public class ProTrackerController : ControllerBase
{
    private readonly IGoalService _goalService;
    private readonly IHabitService _habitService;
    private readonly ITaskService _taskService;
    private readonly IConfiguration _configuration;

    public ProTrackerController(
        IGoalService goalService,
        IHabitService habitService,
        ITaskService taskService,
        IConfiguration configuration)
    {
        _goalService = goalService;
        _habitService = habitService;
        _taskService = taskService;
        _configuration = configuration;
    }

    /// <summary>
    /// Loads all goal data, including tasks, logs, projects, and habits.
    /// </summary>
    /// <returns>A collection of all tracked entities.</returns>
    [HttpGet]
    public async Task<IActionResult> LoadAllData()
    {
        var tasks = await _taskService.GetAllTasksAsync();
        var taskLogs = await _taskService.GetAllTaskStatusLogsAsync();
        var projects = await _goalService.GetAllGoalsAsync();
        var habits = await _habitService.GetAllHabitsAsync();
        var habitLogs = await _habitService.GetAllHabitLogsAsync();
        var version = _configuration["AppVersion"] ?? "3.0.0";

        return Ok(new
        {
            tasks,
            taskLogs,
            projects,
            habits,
            habitLogs,
            appVersion = version
        });
    }
}
