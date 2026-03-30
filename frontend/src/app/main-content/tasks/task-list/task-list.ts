import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { OverdueTasks } from './overdue-tasks/overdue-tasks';
import { ActiveTasks } from './active-tasks/active-tasks';
import { CompletedTasks } from './completed-tasks/completed-tasks';

@Component({
  selector: 'pt-task-list',
  standalone: true,
  imports: [OverdueTasks, ActiveTasks, CompletedTasks],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  readonly showCompleted = input(true);
}
