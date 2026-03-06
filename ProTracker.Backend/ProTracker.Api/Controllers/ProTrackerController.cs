using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
using ProTracker.Models;
using ClosedXML.Excel;

namespace ProTracker.Api.Controllers;

/// <summary>
/// Controller for managing project tracking data, habits, and tasks.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProTrackerController : ControllerBase
{
    private readonly ProTrackerDbContext _context;
    private readonly IConfiguration _configuration;

    public ProTrackerController(ProTrackerDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Loads all project data, including tasks, logs, projects, and habits.
    /// </summary>
    /// <returns>A collection of all tracked entities.</returns>
    [HttpGet("load-data")]
    public async Task<IActionResult> LoadData()
    {
        var tasks = await _context.Tasks.ToListAsync();
        var taskLogs = await _context.StatusLogs.ToListAsync();
        var projects = await _context.Projects.ToListAsync();
        var habits = await _context.Habits.ToListAsync();
        var habitLogs = await _context.HabitLogs.ToListAsync();
        var version = _configuration["AppVersion"] ?? "1.0.0";

        return Ok(new
        {
            tasks,
            taskLogs,
            projects,
            habits,
            habitLogs,
            appVersion = version
        });
    }

    /// <summary>
    /// Creates a new task and associated project if it doesn't exist.
    /// </summary>
    /// <param name="newTask">The new task details.</param>
    /// <returns>The created task, log, and project.</returns>
    [HttpPost("new-task")]
    public async Task<IActionResult> NewTask([FromBody] NewTaskDto newTask)
    {
        var project = await _context.Projects.FirstOrDefaultAsync(p => p.Name == newTask.Project.Trim());
        if (project == null)
        {
            project = new Project { Name = newTask.Project.Trim() };
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
        }

        var task = new TrackerTask
        {
            ProjectId = project.Id,
            Summary = newTask.Summary.Trim(),
            ParentId = null
        };
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var log = new StatusLog
        {
            TaskId = task.Id,
            StatusId = Status.PENDING,
            DateTime = newTask.DateTime
        };
        _context.StatusLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            task,
            log,
            project
        });
    }

    /// <summary>
    /// Updates an existing project's name.
    /// </summary>
    /// <param name="project">The project to update.</param>
    /// <returns>True if successful, BadRequest if the name already exists.</returns>
    [HttpPut("edit-project")]
    public async Task<IActionResult> EditProject([FromBody] Project project)
    {
        var existing = await _context.Projects.FirstOrDefaultAsync(p => p.Name == project.Name && p.Id != project.Id);
        if (existing != null)
        {
            return BadRequest("Project name already exists.");
        }

        _context.Entry(project).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProjectExists(project.Id)) return NotFound();
            else throw;
        }

        return Ok(true);
    }

    /// <summary>
    /// Updates an existing task's summary.
    /// </summary>
    /// <param name="task">The task to update.</param>
    /// <returns>True if successful.</returns>
    [HttpPut("edit-task")]
    public async Task<IActionResult> EditTask([FromBody] TrackerTask task)
    {
        var existingTask = await _context.Tasks.FindAsync(task.Id);
        if (existingTask == null) return NotFound();

        existingTask.Summary = task.Summary;
        await _context.SaveChangesAsync();

        return Ok(true);
    }

    /// <summary>
    /// Toggles the status of a task by adding a new status log.
    /// </summary>
    /// <param name="toggleTask">The task ID and new status.</param>
    /// <returns>The newly created status log.</returns>
    [HttpPost("toggle-task")]
    public async Task<IActionResult> ToggleTask([FromBody] ToggleTaskDto toggleTask)
    {
        var log = new StatusLog
        {
            TaskId = toggleTask.TaskId,
            StatusId = toggleTask.NewStatusId,
            DateTime = toggleTask.NewTime
        };
        _context.StatusLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(log);
    }

    /// <summary>
    /// Creates a new habit.
    /// </summary>
    /// <param name="habit">The habit details.</param>
    /// <returns>The created habit.</returns>
    [HttpPost("create-habit")]
    public async Task<IActionResult> CreateHabit([FromBody] Habit habit)
    {
        if (habit.Days > 7 || habit.Days < 1 || string.IsNullOrEmpty(habit.Name))
            return BadRequest("Invalid habit data.");

        var existing = await _context.Habits.AnyAsync(h => h.Name == habit.Name);
        if (existing) return BadRequest("Habit already exists.");

        _context.Habits.Add(habit);
        await _context.SaveChangesAsync();

        return Ok(habit);
    }

    /// <summary>
    /// Updates an existing habit.
    /// </summary>
    /// <param name="habit">The habit to update.</param>
    /// <returns>The updated habit.</returns>
    [HttpPut("edit-habit")]
    public async Task<IActionResult> EditHabit([FromBody] Habit habit)
    {
        if (habit.Days > 7 || habit.Days < 1 || string.IsNullOrEmpty(habit.Name))
            return BadRequest("Invalid habit data.");

        _context.Entry(habit).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(habit);
    }

    /// <summary>
    /// Logs a habit as completed for a given time.
    /// </summary>
    /// <param name="habitDone">The habit ID and completion time.</param>
    /// <returns>The created habit log.</returns>
    [HttpPost("habit-done")]
    public async Task<IActionResult> HabitDone([FromBody] HabitDoneDto habitDone)
    {
        var habitLog = new HabitLog
        {
            HabitId = habitDone.HabitId,
            DateTime = habitDone.Time
        };
        _context.HabitLogs.Add(habitLog);
        await _context.SaveChangesAsync();

        return Ok(habitLog);
    }

    /// <summary>
    /// Exports all project data to an Excel spreadsheet.
    /// </summary>
    /// <returns>An Excel file containing logs and project overview.</returns>
    [HttpGet("export")]
    public async Task<IActionResult> Export()
    {
        using var workbook = new XLWorkbook();
        var logSheet = workbook.Worksheets.Add("Logs");
        var projectSheet = workbook.Worksheets.Add("Project Overview");

        // Simplified log sheet export
        logSheet.Cell(1, 1).Value = "Date";
        logSheet.Cell(1, 2).Value = "Project";
        logSheet.Cell(1, 3).Value = "To-Do";
        logSheet.Cell(1, 4).Value = "Done";
        logSheet.Row(1).Style.Font.Bold = true;

        var logs = await _context.StatusLogs
            .Include(l => l.Task)
            .ThenInclude(t => t.Project)
            .OrderByDescending(l => l.DateTime)
            .ToListAsync();

        int row = 2;
        foreach (var log in logs)
        {
            var date = DateTimeOffset.FromUnixTimeMilliseconds(log.DateTime).DateTime;
            logSheet.Cell(row, 1).Value = date.ToShortDateString();
            logSheet.Cell(row, 2).Value = log.Task.Project.Name;
            
            if (log.StatusId == Status.PENDING)
                logSheet.Cell(row, 3).Value = log.Task.Summary;
            else if (log.StatusId == Status.COMPLETED)
                logSheet.Cell(row, 4).Value = log.Task.Summary;

            row++;
        }

        // Project Overview sheet
        projectSheet.Cell(1, 1).Value = "Sl. no.";
        projectSheet.Cell(1, 2).Value = "Project";
        projectSheet.Row(1).Style.Font.Bold = true;

        var projects = await _context.Projects.ToListAsync();
        row = 2;
        for (int i = 0; i < projects.Count; i++)
        {
            projectSheet.Cell(row, 1).Value = i + 1;
            projectSheet.Cell(row, 2).Value = projects[i].Name;
            row++;
        }

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        var content = stream.ToArray();

        return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "proTrackerExport.xlsx");
    }

    private bool ProjectExists(int id)
    {
        return _context.Projects.Any(e => e.Id == id);
    }
}

public class NewTaskDto
{
    public string Project { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public long DateTime { get; set; }
}

public class ToggleTaskDto
{
    public int TaskId { get; set; }
    public int NewStatusId { get; set; }
    public long NewTime { get; set; }
}

public class HabitDoneDto
{
    public int HabitId { get; set; }
    public long Time { get; set; }
}
