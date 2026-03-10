import { Component, ChangeDetectionStrategy, inject, input, ApplicationRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@models';
import { TaskService, GoalService } from '@services';

@Component({
  selector: 'pt-task-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-item.html',
  styleUrls: ['./task-item.css'],
  host: {
    '[style.view-transition-name]': "'task-' + task().id",
    'style': 'display: block'
  }
})
export class TaskItem {
  task = input.required<Task>();
  isOverdue = input(false);
  isCompleted = computed(() => { return this.task().completed; });

  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private appRef = inject(ApplicationRef);

  getGoalName(goalId: string): string {
    return this.goalService.getGoalById(goalId)?.title || 'Unknown Goal';
  }

  toggleTask(taskId: string) {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        this.taskService.toggleTask(taskId);
        this.appRef.tick();
      });
    } else {
      this.taskService.toggleTask(taskId);
    }
  }

  deleteTask(taskId: string) {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        this.taskService.deleteTask(taskId);
        this.appRef.tick();
      });
    } else {
      this.taskService.deleteTask(taskId);
    }
  }
}
