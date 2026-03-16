namespace ProTracker.Web.Contracts;

public record HabitLogRequest
{
    public required int HabitId { get; set; }
    public required DateTimeOffset LogTime { get; set; }
}