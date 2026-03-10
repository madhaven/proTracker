import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverdueTasks } from './overdue-tasks/overdue-tasks';
import { ActiveTasks } from './active-tasks/active-tasks';
import { CompletedTasks } from './completed-tasks/completed-tasks';

@Component({
  selector: 'pt-task-list',
  standalone: true,
  imports: [CommonModule, OverdueTasks, ActiveTasks, CompletedTasks],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskList {
  showCompleted = model(true);
  currentDate = new Date()
}
