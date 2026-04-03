import { Routes } from '@angular/router';
import { DashboardComponent } from './main-content/dashboard/dashboard.component';
import { TasksComponent } from './main-content/tasks/tasks.component';
import { TaskDetailComponent } from './main-content/tasks/task-detail/task-detail.component';
import { GoalsComponent } from './main-content/goals/goals.component';
import { HabitsComponent } from './main-content/habits/habits.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: 'goals', component: GoalsComponent },
  { path: 'habits', component: HabitsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
