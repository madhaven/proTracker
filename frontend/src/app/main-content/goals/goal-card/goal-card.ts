import { DatePipe } from '@angular/common';
import { Component, input, output, inject, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { Goal, GoalStats, TaskStatus } from '@models';
import { TaskService, UtilService } from '@services';
import { SvgComponent, ButtonComponent } from '@atoms';
import { SvgIcon, AppRouterLinks, ButtonType } from '@constants';

@Component({
  selector: 'pt-goal-card',
  imports: [DatePipe, SvgComponent, ButtonComponent],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.css',
})
export class GoalCard {
  private readonly taskService = inject(TaskService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);
  private readonly router = inject(Router);

  readonly SvgIcon = SvgIcon;
  readonly ButtonType = ButtonType;
  readonly TaskStatus = TaskStatus;
  readonly goal = input.required<Goal>();
  readonly stats = input.required<GoalStats>();
  readonly delete = output();
  
  deleteClick() {
    this.delete.emit();
  }

  toggleTask(taskId: string, event: Event): void {
    event.stopPropagation();
    this.utils.transition(this.appRef, () => {
      this.taskService.toggleTask(taskId);
    });
  }

  navigateToGoal(taskId: string): void {
    this.router.navigate([AppRouterLinks.GoalDetail, taskId]);
  }
}
