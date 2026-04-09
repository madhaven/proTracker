import { Component, ChangeDetectionStrategy, input, computed, inject, signal, ApplicationRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskCard } from '../task-card/task-card';
import { Task, TaskStatus } from '@models';
import { UtilService } from '@services';

@Component({
  selector: 'pt-task-list',
  standalone: true,
  imports: [DatePipe, TaskCard],
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
    const tasks = this.tasks()
      .filter(t => t.taskStatus === TaskStatus.Pending
        && (t.completeBy === null || new Date(t.completeBy!).getTime() >= today))
    const tasksPrioritized = this.utils.arrangeToPriority(tasks);
    return tasksPrioritized;
  });

  readonly overdueTasks = computed(() => {
    const today = this.utils.getTodayStart();
    const tasks = this.tasks()
      .filter(t => t.taskStatus === TaskStatus.Pending
        && t.completeBy !== null
        && new Date(t.completeBy!).getTime() < today);
    const prioritizedTasks = this.utils.arrangeToPriority(tasks);
    return prioritizedTasks;
  });

  readonly completedTasks = computed(() => {
    const tasks = this.tasks()
      .filter(t => t.taskStatus === TaskStatus.Completed);
    const tasksPrioritized = this.utils.arrangeToPriority(tasks);
    return tasksPrioritized;
  });

  toggleFold(): void {
    this.utils.transition(this.appRef, () => {
      this.isFolded.update(f => !f);
    })
  }
}