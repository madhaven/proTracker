using ProTracker.Models;
using Task = ProTracker.Models.Task;
using TaskStatus = ProTracker.Models.TaskStatus;

namespace ProTracker.Interfaces;

public interface ITaskService
{
    public Task<IEnumerable<Task>> GetAllTasksAsync();
    public Task<Task> CreateTaskAsync(Task task);
    public Task<Task> CreateTaskAsync(Task task, int goalId);
    public Task<bool> UpdateTaskAsync(int id, string title, int? goalId);
    public Task<TaskStatusLog> ToggleTaskStatusAsync(int taskId, TaskStatus status, DateTimeOffset time);
    public Task<IEnumerable<TaskStatusLog>> GetAllTaskStatusLogsAsync();
}
