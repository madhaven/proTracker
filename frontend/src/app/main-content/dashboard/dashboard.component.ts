import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, GoalService, StateService } from '@services';
import { ActiveTab } from '@constants';
import { TaskList } from '../tasks/task-list/task-list';
import { QuickStatsComponent } from '../quick-stats/quick-stats.component';

@Component({
  selector: 'pt-dashboard',
  standalone: true,
  imports: [CommonModule, TaskList, QuickStatsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private stateService = inject(StateService);

  activeTab = this.stateService.activeTab;
  ActiveTab = ActiveTab;

  goals = this.goalService.goals;

  getGoalStats(goalId: string) {
    return this.taskService.getGoalStats(goalId);
  }

  setGoalsTab() {
    this.stateService.activeTab.set(ActiveTab.Goals);
  }
}
