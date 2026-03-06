import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, GoalService, HabitService, StateService } from '@services';
import { ActiveTab, SvgIcon } from '@constants';
import { SvgComponent } from '@atoms';

@Component({
  selector: 'pt-dashboard',
  standalone: true,
  imports: [CommonModule, SvgComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private habitService = inject(HabitService);
  private stateService = inject(StateService);

  activeTab = this.stateService.activeTab;
  ActiveTab = ActiveTab;
  SvgIcon = SvgIcon;

  tasks = this.taskService.tasks;
  goals = this.goalService.goals;
  habits = this.habitService.habits;

  pendingTasksToday = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.tasks()
      .filter(t => !t.completed && t.date.startsWith(todayStr))
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  topStreak = computed(() => {
    const habitsList = this.habits();
    if(habitsList.length === 0) return 0;
    return Math.max(...habitsList.map(h => h.streak));
  });

  getGoalName(goalId: string): string {
    return this.goalService.getGoalById(goalId)?.title || 'Unknown Goal';
  }

  getGoalStats(goalId: string) {
    const allTasks = this.tasks().filter(t => t.goalId === goalId);
    const completed = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }

  toggleTask(taskId: string) {
    this.taskService.toggleTask(taskId);
  }
}
