import { Component, ChangeDetectionStrategy, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, GoalService, HabitService } from '@services';
import { TaskStatus } from '@models';

@Component({
  selector: 'pt-quick-stats',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quick-stats.component.html',
  styleUrls: ['./quick-stats.component.css']
})
export class QuickStatsComponent {
  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private habitService = inject(HabitService);

  // provide control to stats
  showCompletion = input<boolean>(false);
  showPending = input<boolean>(true);
  showGoals = input<boolean>(true);
  showStreak = input<boolean>(true);

  tasks = this.taskService.tasks;
  goals = this.goalService.goals;
  habits = this.habitService.habits;

  overdueTasks = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    return this.tasks()
      .filter(t => (t.status == TaskStatus.Pending)
        && t.completeBy !== undefined
        && new Date(t.completeBy).getTime() < todayTime);
  });

  pendingTasks = computed(() => {
    return this.tasks()
      .filter(t => (t.status == TaskStatus.Pending))
      .sort((a,b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
  });

  topStreak = computed(() => {
    const habitsList = this.habits();
    if(habitsList.length === 0) return 0;
    return Math.max(...habitsList.map(h => h.streak));
  });

  completion = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const completed = this.tasks()
      .filter(t => (t.status == TaskStatus.Completed)
        && new Date(t.createdOn).toISOString().startsWith(todayStr))
      .length;
    return Math.ceil(completed * 100 / (this.pendingTasks().length + completed));
  })
}
