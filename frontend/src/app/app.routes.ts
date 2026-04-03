import { Routes } from '@angular/router';
import { DashboardComponent } from './main-content/dashboard/dashboard.component';
import { TasksComponent } from './main-content/tasks/tasks.component';
import { TaskDetailComponent } from './main-content/tasks/task-detail/task-detail.component';
import { GoalsComponent } from './main-content/goals/goals.component';
import { HabitsComponent } from './main-content/habits/habits.component';
import { AppRoutes } from '@constants';

export const routes: Routes = [
  { path: AppRoutes.Today, component: DashboardComponent },
  { path: AppRoutes.Tasks, component: TasksComponent },
  { path: `${AppRoutes.TaskDetail}/:id`, component: TaskDetailComponent },
  { path: AppRoutes.Goals, component: GoalsComponent },
  { path: AppRoutes.Habits, component: HabitsComponent },
  { path: '**', redirectTo: AppRoutes.Today, pathMatch: 'full' },
];
