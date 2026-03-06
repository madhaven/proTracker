import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService, GoalService } from '@services';
import { SvgIcon } from '@constants';
import { SvgComponent } from '@atoms';

@Component({
  selector: 'pt-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  private taskService = inject(TaskService);
  private goalService = inject(GoalService);

  SvgIcon = SvgIcon;

  tasks = this.taskService.tasks;
  goals = this.goalService.goals;

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    goalId: new FormControl(''),
  });

  pendingTasks = computed(() => this.tasks().filter(t => !t.completed).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  completedTasks = computed(() => this.tasks().filter(t => t.completed).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

  getGoalName(goalId: string): string {
    return this.goalService.getGoalById(goalId)?.title || 'Unknown Goal';
  }

  addTask() {
    if (this.taskForm.invalid) return;
    const val = this.taskForm.value;
    
    this.taskService.addTask(val.title!, val.goalId || null);
    this.taskForm.reset({ title: '', goalId: '' });
  }

  toggleTask(taskId: string) {
    this.taskService.toggleTask(taskId);
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }
}
