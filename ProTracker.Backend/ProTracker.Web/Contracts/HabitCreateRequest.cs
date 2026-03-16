namespace ProTracker.Web.Contracts;

internal record HabitCreateRequest
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required HabitPhaseRequest[] Phases = [];
    public IEnumerable<string> Promoters { get; set; } =  Array.Empty<string>();
    public IEnumerable<string> Demoters { get; set; } = Array.Empty<string>();

    public required DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset? DateCompleted { get; set; }
}

public record HabitPhaseRequest
{
    public required ScheduleRequest Schedule { get; set; } 
}

public record ScheduleRequest
{
    public ScheduleTypeRequest Type { get; set; }
    public int RequiredTimes { get; set; }
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