import { Component, ChangeDetectionStrategy, inject, signal, ApplicationRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskService, GoalService, UtilService } from '@services';
import { GoalDialog } from './goal-dialog/goal-dialog';

@Component({
  selector: 'pt-goals',
  standalone: true,
  imports: [DatePipe, GoalDialog],
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
  readonly showDialog = signal(false);

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
