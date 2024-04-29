import { Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { TabsHabitComponent } from './components/tabs-habit/tabs-habit.component';
import { TabsLogComponent } from './components/tabs-log/tabs-log.component';
import { TabsProjectComponent } from './components/tabs-project/tabs-project.component';

export const routes: Routes = [
    { path: "menu", title: "mainmenu", component: MainMenuComponent },
    { path: "logs", title: "proTracker | Logs", component: TabsLogComponent },
    { path: "habits", title: "proTracker | Habits", component: TabsHabitComponent },
    { path: "projects", title: "proTracker | Projects", component: TabsProjectComponent },
    { path: "", redirectTo: "/logs", pathMatch: "full" },
    // TODO: ng { path: "**", component: pagenotfound}
];
