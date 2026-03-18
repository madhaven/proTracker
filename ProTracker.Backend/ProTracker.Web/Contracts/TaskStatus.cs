namespace ProTracker.Web.Contracts;

public enum TaskStatus
{
    Pending = 0,
    InProgress = 1,
    NeedInfo = 2,
    Completed = 3,
    Waiting = 4,
    Cancelled = 5,
}