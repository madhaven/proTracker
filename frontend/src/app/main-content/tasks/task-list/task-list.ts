import { Component, ChangeDetectionStrategy, inject, computed, ChangeDetectorRef, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, GoalService, HabitService } from '@services';
import { QuickStatsComponent } from '../../quick-stats/quick-stats.component';

@Component({
  selector: 'pt-task-list',
  imports: [CommonModule, QuickStatsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskList {
  showCompleted = model(true);
  showStats = model(true);

  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private habitService = inject(HabitService);
  private cdr = inject(ChangeDetectorRef);

  currentDate = new Date();

  tasks = this.taskService.tasks;
  goals = this.goalService.goals;
  habits = this.habitService.habits;

  pendingTasks = computed(() => this.tasks().filter(t => !t.completed).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  completedTasks = computed(() => this.tasks().filter(t => t.completed).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

  getGoalName(goalId: string): string {
    return this.goalService.getGoalById(goalId)?.title || 'Unknown Goal';
  }

  toggleTask(taskId: string) {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        this.taskService.toggleTask(taskId);
        this.cdr.detectChanges();
      });
    } else {
      this.taskService.toggleTask(taskId);
    }
  }

  deleteTask(taskId: string) {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        this.taskService.deleteTask(taskId);
        this.cdr.detectChanges();
      });
    } else {
      this.taskService.deleteTask(taskId);
    }
  }
}
