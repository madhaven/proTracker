import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../task-item/task-item';
import { TaskService, UtilService } from '@services';
import { TaskStatus } from '@models';

@Component({
  selector: 'pt-overdue-tasks',
  standalone: true,
  imports: [CommonModule, TaskItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overdue-tasks.html',
  styleUrls: ['./overdue-tasks.css'],
})
export class OverdueTasks {
  private readonly utils = inject(UtilService);
  private readonly taskService = inject(TaskService);

  overdueTasks = computed(() => {
    const today = this.utils.getTodayStart();
    return this.taskService.tasks()
      .filter(t => (t.status == TaskStatus.Pending) && new Date(t.createdOn).getTime() < today)
      .sort((a,b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
  });
}
