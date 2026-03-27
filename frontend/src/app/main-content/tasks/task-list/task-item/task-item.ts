import { Component, ChangeDetectionStrategy, inject, input, ApplicationRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '@models';
import { TaskService, GoalService, UtilService } from '@services';

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
  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  task = input.required<Task>();
  isCompleted = computed(() => this.task().taskStatus === TaskStatus.Completed );
  isOverdue = computed(() => {
    const dueDate = this.task().completeBy;
    return dueDate === null
      ? false
      : new Date(dueDate!).getTime() < new Date().setHours(0, 0, 0, 0);
  });
  hasDueDate = computed(() => {
    const dueDate = this.task().completeBy;
    return dueDate !== null;
  });

  getGoalName(goalId: string): string {
    return this.goalService.getGoalById(goalId)?.title || 'Unknown Goal';
  }

  toggleTask(taskId: string) {    
    this.utils.transition(this.appRef, () => {
      this.taskService.toggleTask(taskId);
    });
  }

  deleteTask(taskId: string) {    
    this.utils.transition(this.appRef, () => {
      this.taskService.deleteTask(taskId);
    })
  }
}
