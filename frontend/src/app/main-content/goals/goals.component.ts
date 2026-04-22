import { Component, ChangeDetectionStrategy, inject, signal, ApplicationRef, computed } from '@angular/core';
import { TaskService, GoalService, UtilService } from '@services';
import { GoalDialog } from './goal-create-dialog/goal-create-dialog';
import { TaskStatus } from '@models';
import { GoalCard } from "./goal-card/goal-card";

@Component({
  selector: 'pt-goals',
  standalone: true,
  imports: [GoalDialog, GoalCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent {
  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly tasks = this.taskService.tasks;
  readonly goals = this.goalService.goals;

  readonly sortedGoals = computed(() => {
    return [...this.goals()].sort((a, b) => {
      const statsA = this.getGoalStats(a.id);
      const statsB = this.getGoalStats(b.id);
      return statsB.percentage - statsA.percentage;
    });
  });

  readonly showDialog = signal(false);
  readonly TaskStatus = TaskStatus;

  getGoalStats(goalId: string) {
    return this.taskService.getGoalStats(goalId);
  }

  openDialog(): void {
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  deleteGoal(goalId: string): void {
    this.utils.transition(this.appRef, () => {
      this.goalService.deleteGoal(goalId);
      this.taskService.orphanGoalTasks(goalId);
    });
  }
}
