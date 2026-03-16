using ProTracker.Models;
using Task = ProTracker.Models.Task;
using TaskStatus = ProTracker.Models.TaskStatus;

namespace ProTracker.Interfaces;

public interface ITaskService
{
    public Task<IEnumerable<Task>> GetAllTasksAsync();
    public Task<(Task task, TaskStatusLog log, Goal goal)> CreateTaskWithGoalAsync(string title, string project, long dateTimeCreated);
    public Task<bool> UpdateTaskTitleAsync(int id, string title);
    public Task<TaskStatusLog> ToggleTaskStatusAsync(int taskId, TaskStatus status);
    public Task<IEnumerable<TaskStatusLog>> GetAllTaskStatusLogsAsync();
}
