using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Web.Contracts;

namespace ProTracker.Web.Controllers;

[ApiController]
[Route("api/goal")]
internal class GoalController : ControllerBase
{
    private readonly ProTrackerDbContext _context;
    
    public GoalController(ProTrackerDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }
    
    /// <summary>
    /// Updates an existing goalUpdate's name.
    /// </summary>
    /// <param name="id">The id of the goalUpdate.</param>
    /// <param name="goalUpdate">The goalUpdate to update.</param>
    /// <returns>True if successful, BadRequest if the name already exists.</returns>
    [HttpPut("{guid:int}")]
    public async Task<IActionResult> EditGoal(int id, GoalUpdateRequest goalUpdate)
    {
        var existing = await _context.Goals.FirstOrDefaultAsync(p => p.Title == goalUpdate.Title && p.Id != goalUpdate.Id);
        if (existing != null)
        {
            return BadRequest("Goals name already exists.");
        }

        _context.Entry(goalUpdate).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (GoalExists(goalUpdate.Id)) throw;
            return NotFound();
        }

        return Ok(true);
    }
    
    private bool GoalExists(int id)
    {
        return _context.Goals.Any(e => e.Id == id);
    }
}