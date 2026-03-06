using Microsoft.EntityFrameworkCore;
using ProTracker.Models;

namespace ProTracker.Data;

public class ProTrackerDbContext : DbContext
{
    public ProTrackerDbContext(DbContextOptions<ProTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<TrackerTask> Tasks { get; set; } = null!;
    public DbSet<Status> Statuses { get; set; } = null!;
    public DbSet<StatusLog> StatusLogs { get; set; } = null!;
    public DbSet<Habit> Habits { get; set; } = null!;
    public DbSet<HabitLog> HabitLogs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>(entity =>
        {
            entity.ToTable("project");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<TrackerTask>(entity =>
        {
            entity.ToTable("task");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProjectId).HasColumnName("project_id");
            entity.Property(e => e.Summary).HasColumnName("summary");
            entity.Property(e => e.ParentId).HasColumnName("parent_id");

            entity.HasOne(d => d.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(d => d.ProjectId);

            entity.HasOne(d => d.Parent)
                .WithMany(p => p.Children)
                .HasForeignKey(d => d.ParentId);
        });

        modelBuilder.Entity<Status>(entity =>
        {
            entity.ToTable("status");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("status");
        });

        modelBuilder.Entity<StatusLog>(entity =>
        {
            entity.ToTable("status_log");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TaskId).HasColumnName("task_id");
            entity.Property(e => e.StatusId).HasColumnName("status_id");
            entity.Property(e => e.DateTime).HasColumnName("date_time");

            entity.HasOne(d => d.Task)
                .WithMany(p => p.StatusLogs)
                .HasForeignKey(d => d.TaskId);

            entity.HasOne(d => d.Status)
                .WithMany()
                .HasForeignKey(d => d.StatusId);
        });

        modelBuilder.Entity<Habit>(entity =>
        {
            entity.ToTable("habit");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Removed).HasColumnName("removed");
            entity.Property(e => e.StartTime).HasColumnName("start_time");
            entity.Property(e => e.EndTime).HasColumnName("end_time");
            entity.Property(e => e.Days).HasColumnName("days");
        });

        modelBuilder.Entity<HabitLog>(entity =>
        {
            entity.ToTable("habit_log");
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.HabitId).HasColumnName("habit_id");
            entity.Property(e => e.DateTime).HasColumnName("date_time");

            entity.HasOne(d => d.Habit)
                .WithMany(p => p.HabitLogs)
                .HasForeignKey(d => d.HabitId);
        });
    }
}
