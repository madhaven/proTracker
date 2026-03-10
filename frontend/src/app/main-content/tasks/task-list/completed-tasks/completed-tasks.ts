import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../task-item/task-item';
import { TaskService } from '@services';

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
    .filter(t => t.completed)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
}
