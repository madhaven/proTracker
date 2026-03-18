using Microsoft.AspNetCore.Mvc;
using ProTracker.Interfaces;
using ProTracker.Models;
using ProTracker.Web.Contracts;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/goal")]
public class GoalController : ControllerBase
{
    private readonly IGoalService _goalService;
    
    public GoalController(IGoalService goalService)
    {
        _goalService = goalService ?? throw new ArgumentNullException(nameof(goalService));
    }

    [HttpGet]
    public async Task<IActionResult> GetAllGoals()
    {
        var result = await _goalService.GetAllGoalsAsync();
        return Ok(result);
    }
    
    /// <summary>
    /// Updates an existing goal's name.
    /// </summary>
    /// <param name="id">The id of the goal.</param>
    /// <param name="goalUpdate">The goal to update.</param>
    /// <returns>True if successful, BadRequest if the name already exists.</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> EditGoal(int id, GoalUpdateRequest goalUpdate)
    {
        if (await _goalService.GoalTitleExistsAsync(goalUpdate.Title, id))
        {
            return BadRequest("Goals name already exists.");
        }

        var goal = new Goal
        {
            Id = id,
            Title = goalUpdate.Title,
        };

        var result = await _goalService.UpdateGoalAsync(id, goal);
        if (!result)
        {
            return NotFound();
        }

        return Ok(true);
    }
}
