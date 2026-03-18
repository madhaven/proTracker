using Microsoft.AspNetCore.Mvc;
using ProTracker.Interfaces;
using ProTracker.Models;
using ProTracker.Web.Contracts;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/habit")]
public class HabitController : ControllerBase
{
    private readonly IHabitService _habitService;

    public HabitController(IHabitService habitService)
    {
        _habitService = habitService ?? throw new ArgumentNullException(nameof(habitService));
    }

    [HttpGet]
    public async Task<IActionResult> GetAllHabits()
    {
        var habits = await _habitService.GetAllHabitsAsync();
        return Ok(habits);
    }

    /// <summary>
    /// Creates a new habit.
    /// </summary>
    /// <param name="habitRequest">The habit details.</param>
    /// <returns>The created habit.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateHabit(HabitCreateRequest habitRequest)
    {
        if (await _habitService.HabitTitleExistsAsync(habitRequest.Title))
        {
            return BadRequest("Habit already exists.");
        }

        var habit = await _habitService.CreateHabitAsync(habitRequest.Title, habitRequest.Description);
        return Ok(habit);
    }

    /// <summary>
    /// Updates an existing habit.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="habitRequest">The habit to update.</param>
    /// <returns>The updated habit.</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateHabit(int id, HabitUpdateRequest habitRequest)
    {
        var habit = new Habit
        {
            Id = id,
            Title = habitRequest.Title,
        };

        var success = await _habitService.UpdateHabitAsync(id, habit);
        if (!success) return NotFound();

        return Ok(habit);
    }

    /// <summary>
    /// Logs a habit as completed for a given time.
    /// </summary>
    /// <param name="logRequest">The habit ID and completion time.</param>
    /// <returns>The created habit log.</returns>
    [HttpPut("log")]
    public async Task<IActionResult> HabitDone(HabitLogRequest logRequest)
    {
        var habitLog = await _habitService.LogHabitAsync(logRequest.HabitId, logRequest.LogTime);
        return Ok(habitLog);
    }
}
