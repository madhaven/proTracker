import { Routes } from '@angular/router';
import { TabsHabitComponent } from './components/tabs-habit/tabs-habit.component';
import { TabsLogComponent } from './components/tabs-log/tabs-log.component';
import { TabsProjectComponent } from './components/tabs-project/tabs-project.component';

export const routes: Routes = [
    { path: "logs", title: "proTracker | Logs", component: TabsLogComponent },
    { path: "habits", title: "proTracker | Habits", component: TabsHabitComponent },
    { path: "projects", title: "proTracker | Projects", component: TabsProjectComponent },
    { path: "", redirectTo: "/logs", pathMatch: "full" },
    { path: "**", redirectTo: "/logs"  },
];
