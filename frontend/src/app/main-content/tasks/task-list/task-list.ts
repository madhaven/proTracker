import { Component, ChangeDetectionStrategy, input, computed, inject, signal, ApplicationRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskItem } from './task-item/task-item';
import { Task, TaskStatus } from '@models';
import { UtilService } from '@services';

@Component({
  selector: 'pt-task-list',
  standalone: true,
  imports: [DatePipe, TaskItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private readonly utils = inject(UtilService);
  private readonly appRef = inject(ApplicationRef);

  readonly tasks = input.required<Task[]>();
  readonly showCompleted = input(true);
  readonly showOverdue = input(true);
  readonly showActive = input(true);

  readonly isFolded = signal(true);
  readonly currentDate = new Date();

  readonly pendingTasks = computed(() => {
    const today = this.utils.getTodayStart();
    return this.tasks()
      .filter(t => t.taskStatus === TaskStatus.Pending
        && (t.completeBy === null || new Date(t.completeBy!).getTime() >= today))
      .sort((a, b) => {
        const timeA = a.createdOn ? new Date(a.createdOn).getTime() : 0;
        const timeB = b.createdOn ? new Date(b.createdOn).getTime() : 0;
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });
  });

  readonly overdueTasks = computed(() => {
    const today = this.utils.getTodayStart();
    return this.tasks()
      .filter(t => t.taskStatus === TaskStatus.Pending
        && t.completeBy !== null
        && new Date(t.completeBy!).getTime() < today)
      .sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
  });

  readonly completedTasks = computed(() => this.tasks()
    .filter(t => t.taskStatus === TaskStatus.Completed)
    .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()));

  toggleFold(): void {
    this.utils.transition(this.appRef, () => {
      this.isFolded.update(f => !f);
    })
  }
}