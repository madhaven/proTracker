import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { MenuTabs } from '../common/menu-tabs';

@Component({
  selector: 'pui-main-menu',
  standalone: true,
  imports: [],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  menuVisible: boolean;
  uiStateService:UiStateService
  
  @ViewChild("inputsArea") inputsArea!: ElementRef;
  @Output() tabSwitch: EventEmitter<MenuTabs> = new EventEmitter(true)
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
      ;// TODO: ng Export
    } else {
      this.uiStateService.switchTab(tab)
      this.tabSwitch.emit(tab)
      if (tab == MenuTabs.TaskLogs)
        this.inputsArea.nativeElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  // handles the open and close of the sidebar
  toggleMenuBar(visible:boolean|null = null): void {
    this.menuVisible = visible == null
      ? !this.menuVisible
      : visible
  }
}
