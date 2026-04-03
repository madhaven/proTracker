import { Component, ChangeDetectionStrategy, inject, input, ApplicationRef, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Task, TaskStatus } from '@models';
import { TaskService, GoalService, UtilService } from '@services';
import { SvgComponent } from '@atoms';
import { SvgIcon } from '@constants';

@Component({
  selector: 'pt-task-item',
  standalone: true,
  imports: [DatePipe, SvgComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
  host: {
    '[style.view-transition-name]': "'task-' + task().id",
    'style': 'display: block'
  }
})
export class TaskItem {
  SvgIcon = SvgIcon;
  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);
  private readonly router = inject(Router);

  readonly task = input.required<Task>();

  readonly isCompleted = computed(() => this.task().taskStatus === TaskStatus.Completed);

  readonly isOverdue = computed(() => {
    if (this.isCompleted()) return false;
    const dueDate = this.task().completeBy;
    return dueDate === null
      ? false
      : new Date(dueDate!).getTime() < new Date().setHours(0, 0, 0, 0);
  });

  readonly hasDueDate = computed(() => this.task().completeBy !== null);

  getGoalName(goalId: string): string {
    return this.goalService.getGoalById(goalId)?.title || 'Unknown Goal';
  }

  toggleTask(taskId: string, event: Event): void {
    event.stopPropagation();
    this.utils.transition(this.appRef, () => {
      this.taskService.toggleTask(taskId);
    });
  }

  deleteTask(taskId: string): void {
    this.utils.transition(this.appRef, () => {
      this.taskService.deleteTask(taskId);
    });
  }

  navigateToDetail(taskId: string): void {
    this.utils.transition(this.appRef, () => {
      this.router.navigate(['/task', taskId]);
    });
  }
}
