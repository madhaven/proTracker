using ProTracker.Models;

namespace ProTracker.Interfaces;

public interface IGoalService
{
    Task<IEnumerable<Goal>> GetAllGoalsAsync();
    Task<Goal?> GetGoalByIdAsync(int id);
    Task<Goal> CreateGoalAsync(Goal goal);
    Task<bool> UpdateGoalAsync(int id, Goal goal);
    Task<bool> GoalExistsAsync(int id);
    Task<bool> GoalTitleExistsAsync(string title, int? excludeId = null);
}
