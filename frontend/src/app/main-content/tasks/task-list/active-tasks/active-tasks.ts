import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../task-item/task-item';
import { TaskService, UtilService } from '@services';
import { TaskStatus } from '@models';

@Component({
  selector: 'pt-active-tasks',
  standalone: true,
  imports: [CommonModule, TaskItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './active-tasks.html',
  styleUrls: ['./active-tasks.css'],
})
export class ActiveTasks {
  private readonly taskService = inject(TaskService);
  private readonly utils = inject(UtilService);

  currentDate = new Date();

  pendingTasks = computed(() => {
    const today = this.utils.getTodayStart();
    return this.taskService.tasks()
      .filter(t => t.status == TaskStatus.Pending
        && (t.completeBy === null 
          || t.completeBy === undefined
          || new Date(t.completeBy).getTime() >= today))
      .sort((a, b) => {
        const timeA = a.createdOn ? new Date(a.createdOn).getTime() : 0;
        const timeB = b.createdOn ? new Date(b.createdOn).getTime() : 0;
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });
  });
}
