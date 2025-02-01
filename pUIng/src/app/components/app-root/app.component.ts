import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { UiStateService } from '../../services/ui-state.service';
import { MenuTabs } from '../../common/menu-tabs';
import { CommonModule } from '@angular/common';
import { HintLineComponent } from '../../common/hint-line/hint-line.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MainMenuComponent,
    CommonModule,
    HintLineComponent,
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
