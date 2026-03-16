using System.ComponentModel.DataAnnotations;

namespace ProTracker.Web.Contracts;

public record HabitCreateRequest
{
    [Required]
    public required string Title { get; set; }
    [Required]
    public required string Description { get; set; }
    [Required]
    public required HabitPhaseRequest[] Phases = [];
    public IEnumerable<string> Promoters { get; set; } =  Array.Empty<string>();
    public IEnumerable<string> Demoters { get; set; } = Array.Empty<string>();

    [Required]
    public required DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset? DateCompleted { get; set; }
}

public record HabitPhaseRequest
{
    [Required]
    public required ScheduleRequest Schedule { get; set; } 
}

public record ScheduleRequest
{
    public ScheduleTypeRequest Type { get; set; }
    [Required]
    public required int RequiredTimes { get; set; }
    public int? DaysOfWeek { get; set; }

    public DateTimeOffset StartedAt { get; set; }
    public DateTimeOffset? EndedAt { get; set; }
}

public enum ScheduleTypeRequest
{
    Daily,
    Weekly,
    Monthly
}