using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProTracker.Data;
// using ClosedXML.Excel;

namespace ProTracker.Web.Controllers;

/// <summary>
/// Controller for managing goal tracking data, habits, and tasks.
/// </summary>
[ApiController]
[Route("api/pt")]
internal class ProTrackerController : ControllerBase
{
    private readonly ProTrackerDbContext _context;
    private readonly IConfiguration _configuration;

    public ProTrackerController(ProTrackerDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Loads all goal data, including tasks, logs, projects, and habits.
    /// </summary>
    /// <returns>A collection of all tracked entities.</returns>
    [HttpGet]
    public async Task<IActionResult> LoadAllData()
    {
        var tasks = await _context.Tasks.ToListAsync();
        var taskLogs = await _context.TaskStatusLogs.ToListAsync();
        var projects = await _context.Goals.ToListAsync();
        var habits = await _context.Habits.ToListAsync();
        var habitLogs = await _context.HabitLogs.ToListAsync();
        var version = _configuration["AppVersion"] ?? "3.0.0";

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

    // /// <summary>
    // /// Exports all goal data to an Excel spreadsheet.
    // /// </summary>
    // /// <returns>An Excel file containing logs and goal overview.</returns>
    // [HttpGet("export")]
    // public async Task<IActionResult> Export()
    // {
    //     using var workbook = new XLWorkbook();
    //     var logSheet = workbook.Worksheets.Add("Logs");
    //     var projectSheet = workbook.Worksheets.Add("Goals Overview");
    //
    //     // Simplified log sheet export
    //     logSheet.Cell(1, 1).Value = "Date";
    //     logSheet.Cell(1, 2).Value = "Goals";
    //     logSheet.Cell(1, 3).Value = "To-Do";
    //     logSheet.Cell(1, 4).Value = "Done";
    //     logSheet.Row(1).Style.Font.Bold = true;
    //
    //     var logs = await _context.TaskStatusLogs
    //         .Include(l => l.Task)
    //         .ThenInclude(t => t.Goal)
    //         .OrderByDescending(l => l.DateTime)
    //         .ToListAsync();
    //
    //     int row = 2;
    //     foreach (var log in logs)
    //     {
    //         var date = DateTimeOffset.FromUnixTimeMilliseconds(log.DateTime).DateTime;
    //         logSheet.Cell(row, 1).Value = date.ToShortDateString();
    //         logSheet.Cell(row, 2).Value = log.Task.Goal.Title;
    //         
    //         if (log.StatusId == TaskStatus.Pending)
    //             logSheet.Cell(row, 3).Value = log.Task.Summary;
    //         else if (log.StatusId == TaskStatus.Completed)
    //             logSheet.Cell(row, 4).Value = log.Task.Summary;
    //
    //         row++;
    //     }
    //
    //     // Goals Overview sheet
    //     projectSheet.Cell(1, 1).Value = "Sl. no.";
    //     projectSheet.Cell(1, 2).Value = "Goals";
    //     projectSheet.Row(1).Style.Font.Bold = true;
    //
    //     var projects = await _context.Goals.ToListAsync();
    //     row = 2;
    //     for (int i = 0; i < projects.Count; i++)
    //     {
    //         projectSheet.Cell(row, 1).Value = i + 1;
    //         projectSheet.Cell(row, 2).Value = projects[i].Title;
    //         row++;
    //     }
    //
    //     using var stream = new MemoryStream();
    //     workbook.SaveAs(stream);
    //     var content = stream.ToArray();
    //
    //     return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "proTrackerExport.xlsx");
    // }
}