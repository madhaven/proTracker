using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Implementation;
using ProTracker.Models;
using ProTracker.Web.Contracts;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/habit")]
internal class HabitController : ControllerBase
{
    private readonly ProTrackerDbContext _context;

    public HabitController(ProTrackerDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    /// <summary>
    /// Creates a new habit.
    /// </summary>
    /// <param name="habitRequest">The habit details.</param>
    /// <returns>The created habit.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateHabit(HabitCreateRequest habitRequest)
    {
        // if (habit.Days > 7 || habit.Days < 1 || string.IsNullOrEmpty(habit.Name))
        //     return BadRequest("Invalid habit data.");

        var existing = await _context.Habits.AnyAsync(h => h.Title == habitRequest.Title);
        if (existing)
        {
            return BadRequest("Habit already exists.");
        }

        var habit = new Habit // TODO
        {
            Title = habitRequest.Title,
            Description = habitRequest.Description,
        };

        _context.Habits.Add(habit.ToDbModel());
        await _context.SaveChangesAsync();
        return Ok(habit);
    }

    /// <summary>
    /// Updates an existing habit.
    /// </summary>
    /// <param name="id"></param>
    /// <param name="habit">The habit to update.</param>
    /// <returns>The updated habit.</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> EditHabit(int id, HabitUpdateRequest habit)
    {
        // if (habit.Days > 7 || habit.Days < 1 || string.IsNullOrEmpty(habit.Title))
        //     return BadRequest("Invalid habit data.");

        _context.Entry(habit).State = EntityState.Modified;
        await _context.SaveChangesAsync();

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
        var habit = await _context.Habits.FindAsync(logRequest.HabitId) ?? throw new InvalidOperationException();
        var habitLog = new HabitLog
        {
            Habit = habit.ToModel(),
            LogTime = logRequest.LogTime,
        };
        _context.HabitLogs.Add(habitLog.ToDbModel());
        await _context.SaveChangesAsync();

        return Ok(habitLog);
    }
}