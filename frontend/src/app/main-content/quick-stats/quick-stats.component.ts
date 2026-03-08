import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
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
}
