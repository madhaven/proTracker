using Microsoft.EntityFrameworkCore;
using ProTracker.Data.DBModels;

namespace ProTracker.Data;

public class ProTrackerDbContext : DbContext
{
    public ProTrackerDbContext(DbContextOptions<ProTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<DBModels.Task> Tasks { get; set; } = null!;
    public DbSet<TaskStatusLog> TaskStatusLogs { get; set; } = null!;

    public DbSet<Goal> Goals { get; set; } = null!;
    // public DbSet<GoalStatusLogs> GoalStatusLogs { get; set; } = null!;

    public DbSet<Habit> Habits { get; set; } = null!;
    public DbSet<HabitLog> HabitLogs { get; set; } = null!;
    public DbSet<HabitPhase> HabitPhases { get; set; } = null!;
}
