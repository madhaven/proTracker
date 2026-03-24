import { Component, ChangeDetectionStrategy, inject, output, ElementRef, ViewChild, AfterViewInit, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, GoalService, UtilService } from '@services';
import { ModalComponent } from '@atoms';

@Component({
  selector: 'pt-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-dialog.html',
  styleUrls: ['./task-dialog.css'],
})
export class TaskDialog implements AfterViewInit {
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  
  private readonly taskService = inject(TaskService);
  private readonly goalService = inject(GoalService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  goals = this.goalService.goals;
  close = output<void>();

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    goalId: new FormControl(''),
    date: new FormControl(''),
  });

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.titleInput?.nativeElement) {
        this.titleInput.nativeElement.focus();
      }
    }, 50);
  }

  addTask() {
    if (this.taskForm.invalid) return;
    const val = this.taskForm.value;

    this.utils.transition(this.appRef, () => {
      this.taskService.addTask(val.title!, val.goalId || null, val.date || null);
    });
    
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }
}
