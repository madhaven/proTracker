import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { StateService, TaskService } from '@services';
import { ActiveTab } from '@constants';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';
import { GoalsComponent } from './goals/goals.component';
import { HabitsComponent } from './habits/habits.component';

@Component({
  selector: 'pt-main-content',
  standalone: true,
  imports: [DashboardComponent, TasksComponent, GoalsComponent, HabitsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly taskService = inject(TaskService);

  readonly activeTab = this.stateService.activeTab;
  readonly ActiveTab = ActiveTab;

  ngOnInit(): void {
    this.taskService.generateHabitTasks();
  }
}
