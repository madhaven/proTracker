import { Component, ChangeDetectionStrategy, inject, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, HabitService, UtilService } from '@services';

@Component({
  selector: 'pt-habits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.css']
})
export class HabitsComponent {
  private readonly taskService = inject(TaskService);
  private readonly habitService = inject(HabitService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  habits = this.habitService.habits;

  habitForm = new FormGroup({
    title: new FormControl('', Validators.required),
    frequency: new FormControl<'daily' | 'weekly'>('daily', Validators.required),
  });

  addHabit() {
    if (this.habitForm.invalid) return;
    const val = this.habitForm.value;

    this.utils.transition(this.appRef, () => {
      this.habitService.addHabit(val.title!, val.frequency as 'daily' | 'weekly');
      this.taskService.generateHabitTasks();
    });
    
    this.habitForm.reset({ frequency: 'daily' });
  }

  deleteHabit(habitId: string) {
    this.utils.transition(this.appRef, () => {
      this.habitService.deleteHabit(habitId);
      this.taskService.removeHabitTasks(habitId);
    })
  }
}
