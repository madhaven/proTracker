using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Interfaces;
using ProTracker.Models;

namespace ProTracker.Implementation.Services;

public class GoalService : IGoalService
{
    private readonly ProTrackerDbContext _context;

    public GoalService(ProTrackerDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<Goal>> GetAllGoalsAsync()
    {
        var dbGoals = await _context.Goals.ToListAsync();
        return dbGoals.Select(g => g.ToModel());
    }

    public async Task<Goal?> GetGoalByIdAsync(int id)
    {
        var dbGoal = await _context.Goals.FindAsync(id);
        return dbGoal?.ToModel();
    }

    public async Task<Goal> CreateGoalAsync(Goal goal)
    {
        var dbGoal = goal.ToDbModel();
        _context.Goals.Add(dbGoal);
        await _context.SaveChangesAsync();
        return dbGoal.ToModel();
    }

    public async Task<bool> UpdateGoalAsync(int id, Goal goal)
    {
        var existingGoal = await _context.Goals.FindAsync(id);
        if (existingGoal == null) return false;

        existingGoal.Title = goal.Title;
        existingGoal.DateAdded = goal.DateAdded;
        existingGoal.DateCompleted = goal.DateCompleted;
        existingGoal.DateTarget = goal.DateTarget;

        _context.Entry(existingGoal).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await GoalExistsAsync(id)) return false;
            throw;
        }

        return true;
    }

    public async Task<bool> GoalExistsAsync(int id)
    {
        return await _context.Goals.AnyAsync(e => e.Id == id);
    }

    public async Task<bool> GoalTitleExistsAsync(string title, int? excludeId = null)
    {
        var query = _context.Goals.Where(p => p.Title == title);
        if (excludeId.HasValue)
        {
            query = query.Where(p => p.Id != excludeId.Value);
        }
        return await query.AnyAsync();
    }
}
