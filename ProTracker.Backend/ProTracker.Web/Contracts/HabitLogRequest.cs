namespace ProTracker.Web.Contracts;

internal record HabitLogRequest
{
    public required int HabitId { get; set; }
    public required DateTimeOffset LogTime { get; set; }
}