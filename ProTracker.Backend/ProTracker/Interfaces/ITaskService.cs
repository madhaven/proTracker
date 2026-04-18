using ProTracker.Models;
using Task = ProTracker.Models.Task;
using TaskStatus = ProTracker.Models.TaskStatus;

namespace ProTracker.Interfaces;

public interface ITaskService
{
    public Task<IEnumerable<Task>> GetAllTasksAsync();
    public Task<Task> CreateTaskAsync(Task task);
    public Task<Task> CreateTaskAsync(Task task, int goalId);
    public Task<bool> UpdateTaskAsync(Task task);
    public Task<TaskStatusLog> ToggleTaskStatusAsync(int taskId, TaskStatus status, DateTimeOffset time);
    public Task<IEnumerable<TaskStatusLog>> GetAllTaskStatusLogsAsync();
    public Task<bool> DeleteTaskAsync(int id);
    public int CalculateTaskPriority(Task task);
}
