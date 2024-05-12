import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsHabitComponent } from '../tabs-habit/tabs-habit.component';
import { TabsLogComponent } from '../tabs-log/tabs-log.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { TabsProjectComponent } from '../tabs-project/tabs-project.component';
import { UiStateService } from '../../services/ui-state.service';
import { MenuTabs } from '../../common/menu-tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TabsLogComponent,
    TabsHabitComponent,
    MainMenuComponent,
    TabsProjectComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'pUIng';
  uiStateService!: UiStateService;
  
  logsTab: MenuTabs = MenuTabs.TaskLogs;
  habitsTab: MenuTabs = MenuTabs.Habits;
  projectsTab: MenuTabs = MenuTabs.Projects;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
  }

  ngOnInit() {
    setTimeout(() => {
      this.uiStateService.loadData();
    });
  }
}
