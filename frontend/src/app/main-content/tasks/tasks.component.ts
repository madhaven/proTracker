import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskForm } from './task-form/task-form';
import { TaskList } from './task-list/task-list';

@Component({
  selector: 'pt-tasks',
  standalone: true,
  imports: [CommonModule, TaskForm, TaskList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
}
