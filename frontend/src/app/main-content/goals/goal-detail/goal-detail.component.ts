import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalService, TaskService } from '@services';
import { TaskStatus } from '@models';
import { AppRouterLinks } from '@constants';
import { TaskCard } from '../../tasks/task-card/task-card';
import { TaskDialog } from '../../tasks/task-dialog/task-dialog';

@Component({
  selector: 'pt-goal-detail',
  standalone: true,
  imports: [TaskCard, TaskDialog],
  templateUrl: './goal-detail.component.html',
  styleUrl: './goal-detail.component.css'
})
export class GoalDetailComponent {
  readonly TaskStatus = TaskStatus;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly goalService = inject(GoalService);
  private readonly taskService = inject(TaskService);

  readonly goalId = this.route.snapshot.paramMap.get('id');
  readonly showTaskDialog = signal(false);
  
  readonly goal = computed(() => {
    if (!this.goalId) return undefined;
    return this.goalService.getGoalById(this.goalId);
  });

  readonly stats = computed(() => {
    if (!this.goalId) return undefined;
    return this.taskService.getGoalStats(this.goalId);
  });

  goBack() {
    this.router.navigate([AppRouterLinks.Goals]);
  }

  openTaskDialog() {
    this.showTaskDialog.set(true);
  }

  closeTaskDialog() {
    this.showTaskDialog.set(false);
  }
}
