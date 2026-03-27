import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../task-item/task-item';
import { TaskService } from '@services';
import { TaskStatus } from '@models';

@Component({
  selector: 'pt-completed-tasks',
  standalone: true,
  imports: [CommonModule, TaskItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './completed-tasks.html',
  styleUrls: ['./completed-tasks.css'],
})
export class CompletedTasks {
  private readonly taskService = inject(TaskService);

  completedTasks = computed(() => this.taskService.tasks()
    .filter(t => t.taskStatus == TaskStatus.Completed)
    .sort((a,b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()));
}
