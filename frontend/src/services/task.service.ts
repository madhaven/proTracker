import { Injectable, signal, inject } from '@angular/core';
import { Task } from '@models';
import { HabitService } from '@services';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private habitService = inject(HabitService);

  private tasksSignal = signal<Task[]>([
    { id: this.uid(), title: 'Draft system architecture', completed: true, goalId: 'g1', date: new Date().toISOString() },
    { id: this.uid(), title: 'Initialize Git repository', completed: true, goalId: 'g1', date: new Date().toISOString() },
    { id: this.uid(), title: 'Setup continuous integration', completed: false, goalId: 'g1', date: new Date().toISOString() },
    { id: this.uid(), title: 'Call accountant', completed: false, date: new Date().toISOString() },
  ]);

  tasks = this.tasksSignal.asReadonly();

  private uid(): string {
    return crypto.randomUUID();
  }

  addTask(title: string, goalId: string | null = null, habitId: string | null = null, date: string = new Date().toISOString()) {
    const newTask: Task = {
      id: this.uid(),
      title,
      completed: false,
      date,
      goalId,
      habitId
    };
    this.tasksSignal.update(ts => [newTask, ...ts]);
  }

  toggleTask(taskId: string) {
    this.tasksSignal.update(ts => ts.map(t => {
      if (t.id === taskId) {
        const isNowCompleted = !t.completed;
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
    const completed = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }

  orphanGoalTasks(goalId: string) {
    this.tasksSignal.update(ts => ts.map(t => t.goalId === goalId ? { ...t, goalId: null } : t));
  }

  removeHabitTasks(habitId: string) {
    this.tasksSignal.update(ts => ts.filter(t => t.habitId !== habitId || t.completed));
  }

  generateHabitTasks() {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentTasks = this.tasksSignal();
    const newTasks: Task[] = [];
    let stateChanged = false;

    for (const habit of this.habitService.habits()) {
      const hasTaskToday = currentTasks.some(t => 
        t.habitId === habit.id && t.date.startsWith(todayStr)
      );

      if (!hasTaskToday && habit.frequency === 'daily') {
        newTasks.push({
          id: this.uid(),
          title: habit.title,
          completed: false,
          habitId: habit.id,
          date: new Date().toISOString()
        });
        stateChanged = true;
      }
    }

    if (stateChanged) {
      this.tasksSignal.update(ts => [...newTasks, ...ts]);
    }
  }
}
