import { Injectable, computed, inject } from '@angular/core';
import { Task, TaskStatus, TaskToggleRequest } from '@models';
import { HabitService, ApiService } from '@services';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly habitService = inject(HabitService);
  private readonly api = inject(ApiService);

  private readonly tasksResource = this.api.getResource<any>('/task');
  readonly tasks = computed<Task[]>(() => {
    const rawTasks = this.tasksResource.value();
    if (!rawTasks) { return []; }
    return rawTasks as Task[];
  });

  async addTask(title: string, goalId: string | null = null, date: string | null = null): Promise<void> {
    const request = {
      goalId: goalId,
      title: title,
      createdOn: new Date().toISOString(),
      completeBy: date,
      status: TaskStatus.Pending
    };

    await firstValueFrom(this.api.post<Task>('/task', request));
    this.tasksResource.reload();
  }

  async toggleTask(taskId: string): Promise<void> {
    const task = this.tasks().find(t => t.id === taskId)!;    
    const newStatus = task.taskStatus === TaskStatus.Completed
      ? TaskStatus.Pending
      : TaskStatus.Completed;
    
    const taskUpdateRequest: TaskToggleRequest = { 
      TaskId: parseInt(taskId, 10), 
      Status: newStatus,
      Time: new Date()
    };

    this.optimisticUpdate((ts: Task[]) => {
      return ts.map((t: Task) => {
        if (t.id !== taskId) { return t; }
        return { ...t, taskStatus: newStatus };
      });
    });

    await firstValueFrom(this.api.put(`/task/toggle`, taskUpdateRequest));
    this.tasksResource.reload();
  }

  async deleteTask(taskId: string): Promise<void> {
    this.optimisticUpdate((ts: Task[]) => {
      return ts.filter(t => t.id !== taskId);
    });

    await firstValueFrom(this.api.delete(`/task/${taskId}`));
    this.tasksResource.reload();
  }

  getGoalStats(goalId: string) {
    const allTasks = this.tasks().filter(t => t.goalId === goalId);
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.taskStatus === TaskStatus.Completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, percentage };
  }

  async orphanGoalTasks(goalId: string): Promise<void> {
    const tasksToUpdate = this.tasks().filter(t => t.goalId === goalId);
    if (tasksToUpdate.length === 0) return;

    await Promise.all(
      tasksToUpdate.map(t => {
        const taskToUpdate = { ...t, goalId: null };
        return firstValueFrom(this.api.put(`/task/${t.id}`, this.toTaskDto(taskToUpdate)));
      })
    );
    this.tasksResource.reload();
  }

  async removeHabitTasks(habitId: string): Promise<void> {
    const tasksToDelete = this.tasks().filter(t => t.taskStatus !== TaskStatus.Completed
      // && t.habitId === habitId
    );
    if (tasksToDelete.length === 0) return;

    await Promise.all(
      tasksToDelete.map(t => firstValueFrom(this.api.delete(`/task/${t.id}`)))
    );
    this.tasksResource.reload();
  }

  async generateHabitTasks(): Promise<void> {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentTasks = this.tasks();

    const newTasksToCreate = this.habitService.habits()
      .filter(habit => habit.frequency === 'daily')
      .filter(habit => {
        const hasTaskToday = currentTasks.some(t => 
          String(t.createdOn).startsWith(todayStr)
          // && t.habitId === habit.id
        );
        return !hasTaskToday;
      })
      .map(habit => ({
        Title: habit.title,
        Status: TaskStatus.Pending,
        HabitId: habit.id,
        CreatedOn: new Date().toISOString()
      }));

    if (newTasksToCreate.length > 0) {
      await Promise.all(
        newTasksToCreate.map(request => firstValueFrom(this.api.post<Task>('/task', request)))
      );
      this.tasksResource.reload();
    }
  }

  // --- Private Helpers ---

  /**  Takes a function which will manipulate the tasks resource internally before the api returns */
  private optimisticUpdate(fun: (tasks: Task[]) => Task[]): void {
    const currentRawTasks = this.tasksResource.value();
    if (!currentRawTasks) { return; }
    var updatedRawTasks = fun(currentRawTasks);
    this.tasksResource.value.set(updatedRawTasks);
  }

  private toTaskDto(task: Partial<Task>): Record<string, any> {
    return {
      Id: task.id,
      Title: task.title,
      Status: task.taskStatus,
      CreatedOn: task.createdOn,
      CompleteBy: task.completeBy,
      CompletedOn: task.completedOn,
      GoalId: task.goalId,
      // HabitId: task.habitId,
    };
  }
}
