import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';
import { MenuTabs } from '../common/menu-tabs';

@Component({
  selector: 'pui-main-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  menuVisible: boolean;
  uiStateService:UiStateService
  
  logChart: MenuTabs = MenuTabs.TaskLogs
  habits: MenuTabs = MenuTabs.Habits
  projects: MenuTabs = MenuTabs.Projects
  export: MenuTabs = MenuTabs.Export

  constructor(uistateService: UiStateService) {
    this.uiStateService = uistateService
    this.menuVisible = true; // TODO: ng get state variables
  }

  switchToTab(tab:MenuTabs) {
    
    if (tab == MenuTabs.Export) {
      ; // TODO: ng Export
    } else {
      this.uiStateService.switchTab(tab)
    }
  }

  // handles the open and close of the sidebar
  toggleMenuBar(visible:boolean|null = null): void {
    this.menuVisible = visible == null
      ? !this.menuVisible
      : visible
  }
}
