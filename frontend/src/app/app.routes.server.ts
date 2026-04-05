import { RenderMode, ServerRoute } from '@angular/ssr';
import { AppRoutes } from '@constants';

export const serverRoutes: ServerRoute[] = [
  // for SSR
  { path: `${AppRoutes.TaskDetail}/:id`, renderMode: RenderMode.Server },
  { path: `${AppRoutes.GoalDetail}/:id`, renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender }
];
