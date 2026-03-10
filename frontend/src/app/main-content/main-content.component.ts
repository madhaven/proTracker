import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService, TaskService } from '@services';
import { ActiveTab } from '@constants';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';
import { GoalsComponent } from './goals/goals.component';
import { HabitsComponent } from './habits/habits.component';

@Component({
  selector: 'pt-main-content',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardComponent, 
    TasksComponent, 
    GoalsComponent, 
    HabitsComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  private stateService = inject(StateService);
  private taskService = inject(TaskService);
  
  activeTab = this.stateService.activeTab;
  ActiveTab = ActiveTab;

  ngOnInit() {
    this.taskService.generateHabitTasks();
  }
}
