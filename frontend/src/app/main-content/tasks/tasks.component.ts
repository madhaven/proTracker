import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { TaskList } from './task-list/task-list';
import { TaskCreateDialog } from './task-create-dialog/task-create-dialog';
import { TaskService } from '@services';

@Component({
  selector: 'pt-tasks',
  standalone: true,
  imports: [TaskList, TaskCreateDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  private readonly taskService = inject(TaskService);
  
  readonly tasks = this.taskService.tasks;
  readonly showDialog = signal(false);

  openDialog(): void {
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }
}
