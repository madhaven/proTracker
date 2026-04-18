import { Component, ChangeDetectionStrategy, inject, ApplicationRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, HabitService, UtilService } from '@services';

import { ButtonComponent } from '@atoms';
import { ButtonType } from '@constants';

@Component({
  selector: 'pt-habits',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './habits.component.html',
  styleUrl: './habits.component.css'
})
export class HabitsComponent {
  ButtonType = ButtonType;
  private readonly taskService = inject(TaskService);
  private readonly habitService = inject(HabitService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly habits = this.habitService.habits;

  readonly habitForm = new FormGroup({
    title: new FormControl('', Validators.required),
    frequency: new FormControl<'daily' | 'weekly'>('daily', Validators.required),
  });

  addHabit(): void {
    if (this.habitForm.invalid) return;
    const val = this.habitForm.value;

    this.utils.transition(this.appRef, () => {
      this.habitService.addHabit(val.title!, val.frequency as 'daily' | 'weekly');
      this.taskService.generateHabitTasks();
    });

    this.habitForm.reset({ frequency: 'daily' });
  }

  deleteHabit(habitId: string): void {
    this.utils.transition(this.appRef, () => {
      this.habitService.deleteHabit(habitId);
      this.taskService.removeHabitTasks(habitId);
    });
  }
}
