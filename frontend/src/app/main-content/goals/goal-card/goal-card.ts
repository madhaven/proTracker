import { DatePipe } from '@angular/common';
import { Component, input, output, inject, ApplicationRef } from '@angular/core';
import { Goal, GoalStats, TaskStatus } from '@models';
import { TaskService, UtilService } from '@services';

@Component({
  selector: 'pt-goal-card',
  imports: [DatePipe],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.css',
})
export class GoalCard {
  private readonly taskService = inject(TaskService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly TaskStatus = TaskStatus;
  readonly goal = input.required<Goal>();
  readonly stats = input.required<GoalStats>();
  readonly delete = output();
  
  deleteClick() {
    this.delete.emit();
  }

  toggleTask(taskId: string): void {
    this.utils.transition(this.appRef, () => {
      this.taskService.toggleTask(taskId);
    });
  }
}
