using ProTracker.Models;

namespace ProTracker.Interfaces;

public interface IHabitService
{
    Task<IEnumerable<Habit>> GetAllHabitsAsync();
    Task<Habit?> GetHabitByIdAsync(int id);
    Task<Habit> CreateHabitAsync(string title, string? description);
    Task<bool> UpdateHabitAsync(int id, Habit habit);
    Task<HabitLog> LogHabitAsync(int habitId, DateTimeOffset logTime);
    Task<IEnumerable<HabitLog>> GetAllHabitLogsAsync();
    Task<bool> HabitTitleExistsAsync(string title);
}
