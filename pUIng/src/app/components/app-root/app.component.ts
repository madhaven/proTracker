import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsHabitComponent } from '../tabs-habit/tabs-habit.component';
import { TabsLogComponent } from '../tabs-log/tabs-log.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { TabsProjectComponent } from '../tabs-project/tabs-project.component';
import { UiStateService } from '../../services/ui-state.service';
import { MenuTabs } from '../../common/menu-tabs';
import { CommonModule } from '@angular/common';
import { ElectronComService } from '../../services/electron-com.service';
import { DataComService } from '../../services/data-com.service';

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
  comService!: DataComService
  
  currentTab: MenuTabs = MenuTabs.TaskLogs
  logsTab: MenuTabs = MenuTabs.TaskLogs
  habitsTab: MenuTabs = MenuTabs.Habits
  projectsTab: MenuTabs = MenuTabs.Projects

  constructor(
    uiStateService: UiStateService,
    electronComService: ElectronComService
  ) {
    this.uiStateService = uiStateService
    this.comService = electronComService
  }

  ngOnInit() {
    this.currentTab = this.uiStateService.currentTab // TODO: fetch from preferences
    this.comService.loadData().then(
      (res: any) => {
        if (res){
            console.log('data recieved from db', res)
            this.uiStateService.replaceData(res.tasks, res.taskLogs, res.projects, res.habits, res.habitLogs)
        } else {
            console.error('corrupt data received', res)
            // TODO: notification ?
        }
      },
      (err: any) => console.error('server error while loading data') // TODO notification
    )
  }
}
