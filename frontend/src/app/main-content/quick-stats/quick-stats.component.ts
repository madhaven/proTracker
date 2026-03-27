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
  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly habitService = inject(HabitService);

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
      .filter(t => (t.taskStatus == TaskStatus.Pending)
        && t.completeBy !== null
        && new Date(t.completeBy!).getTime() < todayTime);
  });

  pendingTasks = computed(() => {
    return this.tasks()
      .filter(t => (t.taskStatus == TaskStatus.Pending))
        // && (t.completeBy !== null || (t.goalId !== null || t.habitId !== null))) // tasks from goals with a deadline
      .sort((a,b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
  });

  topStreak = computed(() => {
    const habitsList = this.habits();
    if(habitsList.length === 0) return 0;
    return Math.max(...habitsList.map(h => h.streak));
  });

  completedToday = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.tasks()
      .filter(t => (t.taskStatus == TaskStatus.Completed)
        && t.completedOn
        && new Date(t.completedOn).toISOString().startsWith(todayStr));
  });

  completion = computed(() => {
    const pendingTaskCount = this.pendingTasks().length;
    const completedCount = this.completedToday().length;
    const total = completedCount + pendingTaskCount;
    if (total === 0) return '0 / 0';
    return `${completedCount} / ${total}`;
  });
}
