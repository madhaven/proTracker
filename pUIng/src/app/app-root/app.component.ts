import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsHabitComponent } from './../components/tabs-habit/tabs-habit.component';
import { TabsLogComponent } from './../components/tabs-log/tabs-log.component';
import { MainMenuComponent } from './../components/main-menu/main-menu.component';
import { TabsProjectComponent } from './../components/tabs-project/tabs-project.component';
import { UiStateService } from '../services/ui-state.service';
import { MenuTabs } from '../components/common/menu-tabs';
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
export class AppComponent {
  title = 'pUIng';
  uiStateService!: UiStateService
  
  currentTab: MenuTabs = MenuTabs.TaskLogs
  logsTab: MenuTabs = MenuTabs.TaskLogs
  habitsTab: MenuTabs = MenuTabs.Habits
  projectsTab: MenuTabs = MenuTabs.Projects

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }

  ngOnInit() {
    this.currentTab = this.uiStateService.currentTab
  }

  onTabSwitch(destination: MenuTabs) {
    this.uiStateService.switchTab(destination)
    this.currentTab = destination
  }
}
