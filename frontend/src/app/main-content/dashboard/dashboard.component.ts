import { Component, ChangeDetectionStrategy, inject, ApplicationRef } from '@angular/core';
import { TaskService, GoalService, UtilService } from '@services';
import { TaskList } from '../tasks/task-list/task-list';
import { QuickStatsComponent } from '../quick-stats/quick-stats.component';
import { Router } from '@angular/router';
import { AppRouterLinks } from '@constants';

@Component({
  selector: 'pt-dashboard',
  standalone: true,
  imports: [TaskList, QuickStatsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly router = inject(Router);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly tasks = this.taskService.tasks;
  readonly goals = this.goalService.goals;

  getGoalStats(goalId: string) {
    return this.taskService.getGoalStats(goalId);
  }

  navigateToGoal(goalId: string): void {
    this.router.navigate([AppRouterLinks.GoalDetail, goalId]);
  }
}