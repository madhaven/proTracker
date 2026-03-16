namespace ProTracker.Web.Contracts;

public record HabitUpdateRequest
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required HabitPhaseRequest[] Phases = [];
    public IEnumerable<string> Promoters { get; set; } =  Array.Empty<string>();
    public IEnumerable<string> Demoters { get; set; } = Array.Empty<string>();

    public required DateTimeOffset DateAdded { get; set; }
    public DateTimeOffset? DateCompleted { get; set; }
}