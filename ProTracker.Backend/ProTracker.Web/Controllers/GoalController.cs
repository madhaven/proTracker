using Microsoft.AspNetCore.Http.HttpResults;
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
    /// Creates a new goal.
    /// </summary>
    /// <param name="createRequest">The new goal details.</param>
    /// <returns>The created goal.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateGoal(GoalCreateRequest createRequest)
    {
        createRequest.Title = createRequest.Title.Trim();
        createRequest.Description = createRequest.Description?.Trim();
        if (string.IsNullOrWhiteSpace(createRequest.Title) || string.IsNullOrWhiteSpace(createRequest.Description))
        {
            return BadRequest("Valid Title and Description is required.");
        }

        if (await _goalService.GoalTitleExistsAsync(createRequest.Title))
        {
            return BadRequest("Goals name already exists.");
        }

        var goalModel = new Goal
        {
            Title = createRequest.Title,
            Description = createRequest.Description,
            DateAdded = createRequest.DateAdded,
            DateTarget = createRequest.DateTarget,
        };

        var createdGoal = await _goalService.CreateGoalAsync(goalModel);
        var response = createdGoal.ToContract();
        return Ok(response);
    }

    /// <summary>
    /// Updates an existing goal's details.
    /// </summary>
    /// <param name="id">The id of the goal.</param>
    /// <param name="goalUpdate">The goal to update.</param>
    /// <returns>True if successful, BadRequest if the name already exists.</returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateGoal(int id, GoalUpdateRequest goalUpdate)
    {
        goalUpdate.Title = goalUpdate.Title.Trim();
        if (string.IsNullOrWhiteSpace(goalUpdate.Title))
        {
            return BadRequest("Title is required.");
        }

        if (await _goalService.GoalTitleExistsAsync(goalUpdate.Title, id))
        {
            return BadRequest("Goals name already exists.");
        }

        var goal = new Goal
        {
            Id = id,
            Title = goalUpdate.Title,
            DateAdded = goalUpdate.DateAdded,
            DateTarget = goalUpdate.DateTarget,
            DateCompleted = goalUpdate.DateCompleted
        };

        var result = await _goalService.UpdateGoalAsync(id, goal);
        return !result ? ValidationProblem() : Ok(true);
    }

    /// <summary>
    /// Deletes an existing goal.
    /// </summary>
    /// <param name="id">The id of the goal.</param>
    /// <returns>True if successful.</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteGoal(int id)
    {
        var result = await _goalService.DeleteGoalAsync(id);
        return !result ? ValidationProblem() : Ok(true);
    }
}
