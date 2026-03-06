namespace ProTracker.Models;

public class Status
{
    public const int PENDING = 1;
    public const int IN_PROGRESS = 2;
    public const int NEED_INFO = 3;
    public const int COMPLETED = 4;
    public const int WAITING = 5;
    public const int WONT_DO = 6;

    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
