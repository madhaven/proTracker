import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskList } from './task-list/task-list';
import { TaskDialog } from './task-dialog/task-dialog';

@Component({
  selector: 'pt-tasks',
  standalone: true,
  imports: [CommonModule, TaskList, TaskDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  showDialog = signal(false);

  openDialog() {
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
  }
}
