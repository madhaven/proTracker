import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, HabitService } from '@services';

@Component({
  selector: 'pt-habits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.css']
})
export class HabitsComponent {
  private taskService = inject(TaskService);
  private habitService = inject(HabitService);

  habits = this.habitService.habits;

  habitForm = new FormGroup({
    title: new FormControl('', Validators.required),
    frequency: new FormControl<'daily' | 'weekly'>('daily', Validators.required),
  });

  addHabit() {
    if (this.habitForm.invalid) return;
    const val = this.habitForm.value;

    this.habitService.addHabit(val.title!, val.frequency as 'daily' | 'weekly');
    this.habitForm.reset({ frequency: 'daily' });
    this.taskService.generateHabitTasks();
  }

  deleteHabit(habitId: string) {
    this.habitService.deleteHabit(habitId);
    this.taskService.removeHabitTasks(habitId);
  }
}
