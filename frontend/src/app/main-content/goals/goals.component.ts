import { Component, ChangeDetectionStrategy, inject, ApplicationRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TaskService, GoalService, UtilService } from '@services';
import { TaskStatus } from '@models';

@Component({
  selector: 'pt-goals',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
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

  readonly goalForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    targetDate: new FormControl('', Validators.required),
  });

  getGoalStats(goalId: string) {
    return this.taskService.getGoalStats(goalId);
  }

  addGoal(): void {
    if (this.goalForm.invalid) return;
    const val = this.goalForm.value;

    this.utils.transition(this.appRef, () => {
      this.goalService.addGoal(val.title!, val.description || '', val.targetDate!);
    });

    this.goalForm.reset();
  }

  deleteGoal(goalId: string): void {
    this.utils.transition(this.appRef, () => {
      this.goalService.deleteGoal(goalId);
      this.taskService.orphanGoalTasks(goalId);
    });
  }
}
