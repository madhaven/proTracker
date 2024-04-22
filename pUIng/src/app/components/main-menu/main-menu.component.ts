import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';
import { MenuTabs } from '../../common/menu-tabs';

@Component({
  selector: 'pui-main-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent implements OnInit {
  uiStateService:UiStateService
  
  logChart: MenuTabs = MenuTabs.TaskLogs
  habits: MenuTabs = MenuTabs.Habits
  projects: MenuTabs = MenuTabs.Projects
  export: MenuTabs = MenuTabs.Export

  constructor(uistateService: UiStateService) {
    this.uiStateService = uistateService
  }

  ngOnInit(): void {
    ['mousemove', 'mousedown', 'drag', 'keypress', 'scroll'].forEach(event => {
      document.addEventListener(event, () => { this.uiStateService.inactiveDuration = 0 })
    });

    setInterval(() => {
      this.uiStateService.inactiveDuration = ++this.uiStateService.inactiveDuration
      if (this.uiStateService.inactiveDuration >= this.uiStateService.inactivityTolerance
        && this.uiStateService.inactivityTolerance >= -1
        && !this.uiStateService.menuVisible) {
          this.uiStateService.menuVisible = true
          console.info('MenuBar on idle')
        }
    }, 1000);
    console.info('Idle tracking enabled')
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
    this.uiStateService.menuVisible = visible == null
      ? !this.uiStateService.menuVisible
      : visible
  }
}
