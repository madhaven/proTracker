import { Component, ElementRef, Input, input, Optional, SkipSelf, ViewChild } from '@angular/core';
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
  logChart: MenuTabs = MenuTabs.TaskLogs

  constructor(uistateService: UiStateService) {
    this.uiStateService = uistateService
    this.menuVisible = true; // TODO: ng get state variables
  }

  // handles the open and close of the sidebar
  toggleMenuBar(visible:boolean|null = null): void {
    this.menuVisible = visible == null
      ? !this.menuVisible
      : visible
  }

  switchToTab(tab:MenuTabs) {
    if (tab == MenuTabs.TaskLogs) {
      console.log(this.inputsArea)
      this.inputsArea.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
      this.uiStateService.switchTab(MenuTabs.TaskLogs)
    // } else if (tab == MenuTabs.Export) {
    //   ;// TODO: ng Export
    } else {
      this.uiStateService.switchTab(MenuTabs.Habits)
    }
  }
}
