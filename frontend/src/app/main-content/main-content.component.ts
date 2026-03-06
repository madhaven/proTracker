import { Component, ChangeDetectionStrategy, signal, computed, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { TaskService, GoalService, HabitService, StateService } from '../../services';
import { ActiveTab, SvgIcon } from '../../constants';
import { SvgComponent } from '../atoms/svg.component';

@Component({
  selector: 'pt-main-content',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CommonModule, SvgComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit {
  private taskService = inject(TaskService);
  private goalService = inject(GoalService);
  private habitService = inject(HabitService);
  private stateService = inject(StateService);
  
  activeTab = this.stateService.activeTab;
  ActiveTab = ActiveTab;
  SvgIcon = SvgIcon;

  // Core Data State (from Services)
  tasks = this.taskService.tasks;
  goals = this.goalService.goals;
  habits = this.habitService.habits;

  // Forms
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    goalId: new FormControl(''),
  });

  goalForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    targetDate: new FormControl('', Validators.required),
  });

  habitForm = new FormGroup({
    title: new FormControl('', Validators.required),
    frequency: new FormControl<'daily' | 'weekly'>('daily', Validators.required),
  });

  // Computed Values
  pendingTasks = computed(() => this.tasks().filter(t => !t.completed).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  completedTasks = computed(() => this.tasks().filter(t => t.completed).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  
  pendingTasksToday = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.pendingTasks().filter(t => t.date.startsWith(todayStr));
  });

  topStreak = computed(() => {
    const habitsList = this.habits();
    if(habitsList.length === 0) return 0;
    return Math.max(...habitsList.map(h => h.streak));
  });

  ngOnInit() {
    this.taskService.generateHabitTasks();
  }

  // --- Logic Methods ---

  getGoalName(goalId: string): string {
    return this.goalService.getGoalById(goalId)?.title || 'Unknown Goal';
  }

  getGoalStats(goalId: string) {
    const allTasks = this.tasks().filter(t => t.goalId === goalId);
    const completed = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }

  // Task Actions
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

  // Goal Actions
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

  // Habit Actions
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

  // Added this to handle dashboard link to tasks
  // But wait, activeTab is an input here, so it can't be set directly if it's from App.
  // Actually, I should probably use a shared service for navigation if I want to change it from deep within.
}
