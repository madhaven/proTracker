import { Component, ChangeDetectionStrategy, inject, computed, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, GoalService, HabitService } from '@services';

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
  showCompletion = model<boolean>(false);
  showPending = model<boolean>(true);
  showGoals = model<boolean>(true);
  showStreak = model<boolean>(true);

  tasks = this.taskService.tasks;
  goals = this.goalService.goals;
  habits = this.habitService.habits;

  overdueTasks = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    return this.tasks()
      .filter(t => !t.completed && new Date(t.date).getTime() < todayTime);
  });

  pendingTasks = computed(() => {
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

  completion = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const completed = this.tasks()
      .filter(t => t.completed && t.date.startsWith(todayStr))
      .length;
    return Math.ceil(completed * 100 / (this.pendingTasks().length + completed));
  })
}
