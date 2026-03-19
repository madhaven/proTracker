import { Injectable, signal, inject } from '@angular/core';
import { Task, TaskStatus } from '@models';
import { HabitService } from '@services';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private habitService = inject(HabitService);

  private tasksSignal = signal<Task[]>([
    { id: this.uid(), title: 'Draft system architecture', status: TaskStatus.Completed, goalId: 'g1', createdOn: new Date() },
    { id: this.uid(), title: 'Initialize Git repository', status: TaskStatus.Completed, goalId: 'g1', createdOn: new Date() },
    { id: this.uid(), title: 'Setup continuous integration', status: TaskStatus.Pending, goalId: 'g1', createdOn: new Date() },
    { id: this.uid(), title: 'Call accountant', status: TaskStatus.Pending, createdOn: new Date() },
    { id: this.uid(), title: 'Submit tax return', status: TaskStatus.Pending, createdOn: new Date(Date.now() - 86400000 * 3) },
    { id: this.uid(), title: 'Renew domain name', status: TaskStatus.Pending, createdOn: new Date(Date.now() - 86400000 * 1) },
  ]);

  tasks = this.tasksSignal.asReadonly();

  private uid(): string {
    return crypto.randomUUID();
  }

  addTask(title: string, goalId: string | null = null, habitId: string | null = null, date: Date = new Date()) {
    const newTask: Task = {
      id: this.uid(),
      title: title,
      status: TaskStatus.Pending,
      createdOn: date,
      goalId: goalId,
      habitId: habitId
    };
    this.tasksSignal.update(ts => [newTask, ...ts]);
  }

  toggleTask(taskId: string) {
    this.tasksSignal.update(ts => ts.map(t => {
      if (t.id === taskId) {
        const isNowCompleted = t.status == TaskStatus.Completed;
        if (t.habitId) {
          this.habitService.updateStreak(t.habitId, isNowCompleted ? 1 : -1);
        }
        return { ...t, completed: isNowCompleted };
      }
      return t;
    }));
  }

  deleteTask(taskId: string) {
    this.tasksSignal.update(ts => ts.filter(t => t.id !== taskId));
  }

  getGoalStats(goalId: string) {
    const allTasks = this.tasksSignal().filter(t => t.goalId === goalId);
    const completed = allTasks.filter(t => t.status == TaskStatus.Completed).length;
    const total = allTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }

  orphanGoalTasks(goalId: string) {
    this.tasksSignal.update(ts => ts.map(t => t.goalId === goalId ? { ...t, goalId: null } : t));
  }

  removeHabitTasks(habitId: string) {
    this.tasksSignal.update(ts => ts.filter(t => t.habitId !== habitId));
  }

  generateHabitTasks() {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentTasks = this.tasksSignal();
    const newTasks: Task[] = [];
    let stateChanged = false;

    for (const habit of this.habitService.habits()) {
      const hasTaskToday = currentTasks.some(t => 
        t.habitId === habit.id && t.createdOn.toISOString().startsWith(todayStr)
      );

      if (!hasTaskToday && habit.frequency === 'daily') {
        newTasks.push({
          id: this.uid(),
          title: habit.title,
          status: TaskStatus.Pending,
          habitId: habit.id,
          createdOn: new Date()
        });
        stateChanged = true;
      }
    }

    if (stateChanged) {
      this.tasksSignal.update(ts => [...newTasks, ...ts]);
    }
  }
}
