using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Interfaces;
using ProTracker.Models;

namespace ProTracker.Implementation.Services;

public class HabitService : IHabitService
{
    private readonly ProTrackerDbContext _context;

    public HabitService(ProTrackerDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<IEnumerable<Habit>> GetAllHabitsAsync()
    {
        var dbHabits = await _context.Habits.ToListAsync();
        return dbHabits.Select(h => h.ToModel());
    }

    public async Task<Habit?> GetHabitByIdAsync(int id)
    {
        var dbHabit = await _context.Habits.FindAsync(id);
        return dbHabit?.ToModel();
    }

    public async Task<Habit> CreateHabitAsync(string title, string? description)
    {
        var habit = new Habit
        {
            Title = title,
            Description = description,
        };

        var dbHabit = habit.ToDbModel();
        _context.Habits.Add(dbHabit);
        await _context.SaveChangesAsync();
        return dbHabit.ToModel();
    }

    public async Task<bool> UpdateHabitAsync(int id, Habit habit)
    {
        var dbHabit = habit.ToDbModel();
        _context.Entry(dbHabit).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<HabitLog> LogHabitAsync(int habitId, DateTimeOffset logTime)
    {
        var dbHabit = await _context.Habits.FindAsync(habitId) ?? throw new InvalidOperationException("Habit not found");
        var habitLog = new HabitLog
        {
            Habit = dbHabit.ToModel(),
            LogTime = logTime,
        };
        var dbHabitLog = habitLog.ToDbModel();
        _context.HabitLogs.Add(dbHabitLog);
        await _context.SaveChangesAsync();
        return dbHabitLog.ToModel();
    }

    public async Task<IEnumerable<HabitLog>> GetAllHabitLogsAsync()
    {
        var dbHabitLogs = await _context.HabitLogs.Include(h => h.Habit).ToListAsync();
        return dbHabitLogs.Select(hl => hl.ToModel());
    }

    public async Task<bool> HabitTitleExistsAsync(string title)
    {
        return await _context.Habits.AnyAsync(h => h.Title == title);
    }
}
