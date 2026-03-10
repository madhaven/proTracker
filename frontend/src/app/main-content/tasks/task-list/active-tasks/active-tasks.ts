import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../task-item/task-item';
import { TaskService } from '@services';
import { UtilService } from '@services/utils.service';

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
      .filter(t => !t.completed && new Date(t.date).getTime() >= today)
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
}
