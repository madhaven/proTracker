import { Component, ChangeDetectionStrategy, inject, input, output, ElementRef, viewChild, AfterViewInit, OnInit, ApplicationRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, GoalService, UtilService } from '@services';
import { ModalComponent, ButtonComponent } from '@atoms';
import { ButtonType } from '@constants';

@Component({
  selector: 'pt-task-create-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-create-dialog.html',
  styleUrl: './task-create-dialog.css',
})
export class TaskCreateDialog implements OnInit, AfterViewInit {
  readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');
  
  ButtonType = ButtonType;

  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly prefilledGoalId = input<string | null>(null);
  readonly goals = this.goalService.goals;
  readonly handleClose = output<void>();

  readonly taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    goalId: new FormControl(''),
    date: new FormControl(''),
  });

  ngOnInit(): void {
    const goalId = this.prefilledGoalId();
    if (goalId) {
      this.taskForm.patchValue({ goalId });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => { this.titleInput()?.nativeElement?.focus(); }, 50);
  }

  addTask(): void {
    if (this.taskForm.invalid) return;
    const val = this.taskForm.value;

    this.utils.transition(this.appRef, () => {
      this.taskService.addTask(val.title!, val.goalId || null, val.date || null);
    });

    this.handleClose.emit();
  }

  onCancel(): void {
    this.handleClose.emit();
  }
}
