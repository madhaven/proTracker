import { Component, ChangeDetectionStrategy, inject, input, output, ElementRef, ViewChild, AfterViewInit, OnInit, ApplicationRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, GoalService, UtilService } from '@services';
import { ModalComponent } from '@atoms';

@Component({
  selector: 'pt-task-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.css',
})
export class TaskDialog implements OnInit, AfterViewInit {
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly prefilledGoalId = input<string | null>(null);
  readonly goals = this.goalService.goals;
  readonly close = output<void>();

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
    setTimeout(() => { this.titleInput?.nativeElement?.focus(); }, 50);
  }

  addTask(): void {
    if (this.taskForm.invalid) return;
    const val = this.taskForm.value;

    this.utils.transition(this.appRef, () => {
      this.taskService.addTask(val.title!, val.goalId || null, val.date || null);
    });

    this.close.emit();
  }

  onCancel(): void {
    this.close.emit();
  }
}
