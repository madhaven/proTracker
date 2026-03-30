import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskService, GoalService, StateService } from '@services';
import { ActiveTab } from '@constants';
import { TaskList } from '../tasks/task-list/task-list';
import { QuickStatsComponent } from '../quick-stats/quick-stats.component';

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
  private readonly stateService = inject(StateService);

  readonly activeTab = this.stateService.activeTab;
  readonly ActiveTab = ActiveTab;
  readonly goals = this.goalService.goals;

  getGoalStats(goalId: string) {
    return this.taskService.getGoalStats(goalId);
  }

  setGoalsTab(): void {
    this.stateService.activeTab.set(ActiveTab.Goals);
  }
}
