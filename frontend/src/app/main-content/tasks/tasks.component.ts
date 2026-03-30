import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TaskList } from './task-list/task-list';
import { TaskDialog } from './task-dialog/task-dialog';

@Component({
  selector: 'pt-tasks',
  standalone: true,
  imports: [TaskList, TaskDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  readonly showDialog = signal(false);

  openDialog(): void {
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }
}
