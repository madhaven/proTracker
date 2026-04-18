import { Component, ChangeDetectionStrategy, inject, input, output, ElementRef, ViewChild, AfterViewInit, OnInit, ApplicationRef, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, GoalService, UtilService } from '@services';
import { ModalComponent, SvgComponent } from '@atoms';
import { Task, TaskUpdateRequest } from '@models';
import { DatePipe } from '@angular/common';
import { SvgIcon } from '@constants';

@Component({
  selector: 'pt-task-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, SvgComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-edit-dialog.html',
  styleUrl: './task-edit-dialog.css',
})
export class TaskEditDialog implements OnInit, AfterViewInit {
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);
  private initialFormValues: any = null;

  readonly task = input.required<Task>();
  readonly goals = this.goalService.goals;
  readonly SvgIcon = SvgIcon;
  readonly closed = output();
  readonly isLoading = signal(false);
  
  readonly taskForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    goalId: new FormControl<string | null>(null),
    dueDate: new FormControl<Date | null>(null),
  });

  ngOnInit(): void {
    const task = this.task();
    this.taskForm.patchValue({
      title: task.title,
      goalId: task.goalId || null,
      dueDate: task.completeBy ? new Date(task.completeBy) : null
    });

    this.initialFormValues = this.taskForm.getRawValue();
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.taskForm.patchValue({ dueDate: input.valueAsDate });
    this.taskForm.get('dueDate')?.markAsDirty();
  }

  hasChanges(): boolean {
    if (!this.initialFormValues) return false;
    const currentValues = this.taskForm.getRawValue();
    
    const normalize = (val: any): string => {
      if (val instanceof Date) return val.toISOString().split('T')[0];
      return val === null || val === undefined ? '' : String(val).trim();
    };
    
    return normalize(currentValues.title) !== normalize(this.initialFormValues.title) ||
           normalize(currentValues.goalId) !== normalize(this.initialFormValues.goalId) ||
           normalize(currentValues.dueDate) !== normalize(this.initialFormValues.dueDate);
  }

  isSaveDisabled(): boolean {
    return this.taskForm.invalid || this.isLoading() || !this.hasChanges();
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.titleInput?.nativeElement?.focus(); }, 50);
  }

  async updateTask(): Promise<void> {
    if (this.isSaveDisabled()) return;
    
    const val = this.taskForm.getRawValue();
    const t = this.task();
    const updateRequest: TaskUpdateRequest = {
      id: Number(t.id),
      title: val.title,
      status: t.taskStatus,
      goalId: val.goalId ? Number(val.goalId) : null,
      completeBy: val.dueDate,
      completedOn: t.completedOn,
    };

    this.isLoading.set(true);

    try {
      await this.taskService.updateTask(this.task().id, updateRequest);
      this.utils.transition(this.appRef, () => this.closed.emit());
    } catch (error) {
      console.error('Failed to update task:', error);
      this.isLoading.set(false);
    }
  }

  onCancel(): void {
    this.closed.emit();
  }
}
