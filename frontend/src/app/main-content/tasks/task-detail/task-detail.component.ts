import { Component, ChangeDetectionStrategy, inject, computed, ApplicationRef, signal } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, GoalService, UtilService } from '@services';
import { TaskStatus } from '@models';
import { toSignal } from '@angular/core/rxjs-interop';
import { SvgComponent, ButtonComponent } from '@atoms';
import { SvgIcon, AppRouterLinks, ButtonType } from '@constants';
import { TaskEditDialog } from '../task-edit-dialog/task-edit-dialog';

@Component({
  selector: 'pt-task-detail',
  standalone: true,
  imports: [DatePipe, SvgComponent, ButtonComponent, TaskEditDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
  host: {
    'style': 'display: block'
  }
})
export class TaskDetailComponent {
  SvgIcon = SvgIcon;
  ButtonType = ButtonType;

  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly utils = inject(UtilService);
  private readonly appRef = inject(ApplicationRef);
  
  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly id = computed(() => this.paramMap()?.get('id'));

  readonly task = computed(() => {
    const taskId = this.id();
    if (!taskId) return null;
    const tasks = this.taskService.tasks();
    return tasks.find(t => t.id == taskId) || null;
  });

  readonly isCompleted = computed(() => this.task()?.taskStatus === TaskStatus.Completed);
  readonly hasDueDate = computed(() => {
    const task = this.task();
    return task?.completeBy !== null;
  });
  
  readonly isOverdue = computed(() => {
    if (this.isCompleted()) return false;
    const dueDate = this.task()?.completeBy;
    if (!dueDate) return false;
    return new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
  });

  readonly isEditModalOpen = signal(false);

  getGoalName(goalId: string): string | undefined {
    if (!goalId) return '';
    return this.goalService.getGoalById(goalId)?.title;
  }

  goBack(): void {
    this.location.back();
  }

  deleteTask(): void {
    const taskId = this.id();
    if (taskId) {
      this.taskService.deleteTask(taskId);
      this.router.navigate([AppRouterLinks.Tasks]);
    }
  }

  toggleTask(event: Event): void {
    event.stopPropagation();
    const taskId = this.id();
    if (taskId) {
      this.utils.transition(this.appRef, () => {
        this.taskService.toggleTask(taskId);
      });
    }
  }

  openEditModal(): void {
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
  }
}
