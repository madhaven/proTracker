import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, GoalService } from '@services';
import { SvgIcon } from '@constants';
import { SvgComponent } from '@atoms';

@Component({
  selector: 'pt-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, SvgComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent {
  private taskService = inject(TaskService);
  private goalService = inject(GoalService);

  SvgIcon = SvgIcon;

  tasks = this.taskService.tasks;
  goals = this.goalService.goals;

  goalForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    targetDate: new FormControl('', Validators.required),
  });

  getGoalStats(goalId: string) {
    const allTasks = this.tasks().filter(t => t.goalId === goalId);
    const completed = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }

  addGoal() {
    if (this.goalForm.invalid) return;
    const val = this.goalForm.value;

    this.goalService.addGoal(val.title!, val.description || '', val.targetDate!);
    this.goalForm.reset();
  }

  deleteGoal(goalId: string) {
    this.goalService.deleteGoal(goalId);
    this.taskService.orphanGoalTasks(goalId);
  }
}
