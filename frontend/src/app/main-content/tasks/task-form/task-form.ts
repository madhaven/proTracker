import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, GoalService } from '@services';

@Component({
  selector: 'pt-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form.html',
  styleUrls: ['./task-form.css'],
})
export class TaskForm {
  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private cdr = inject(ChangeDetectorRef);

  goals = this.goalService.goals;

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    goalId: new FormControl(''),
  });

  addTask() {
    if (this.taskForm.invalid) return;
    const val = this.taskForm.value;
    
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        this.taskService.addTask(val.title!, val.goalId || null);
        this.cdr.detectChanges();
      });
    } else {
      this.taskService.addTask(val.title!, val.goalId || null);
    }
    
    this.taskForm.reset({ title: '', goalId: '' });
  }
}
