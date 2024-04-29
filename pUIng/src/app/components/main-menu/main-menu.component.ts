import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';
import { MenuTabs } from '../../common/menu-tabs';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'pui-main-menu',
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    LoaderComponent,
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent implements OnInit {

  uiStateService: UiStateService;

  appLoadPercent: number = 0;
  loadStateObserver: Subscription;
  
  menuVisible: boolean = true;
  logChart: MenuTabs = MenuTabs.TaskLogs;
  habits: MenuTabs = MenuTabs.Habits;
  projects: MenuTabs = MenuTabs.Projects;
  export: MenuTabs = MenuTabs.Export;

  idleTime: number = 0;
  idleTolerance: number = 500;

  constructor(uistateService: UiStateService ) {
    this.uiStateService = uistateService;
    this.idleTolerance = uistateService.idleTolerance;
    this.loadStateObserver = this.uiStateService.loading$.subscribe((percent) => {
      if (percent != 100)
        this.appLoadPercent = percent;
      else
        setTimeout(() => {
          this.appLoadPercent = percent;
        }, 2000);
    });
  }

  ngOnInit(): void {
    this.enableIdleTracking()
  }

  enableIdleTracking() {
    ['mousemove', 'mousedown', 'drag', 'keypress', 'scroll'].forEach(event => {
      document.addEventListener(event, () => { this.idleTime = 0 });
    });

    setInterval(() => {
      this.idleTime = ++this.idleTime;
      if (this.idleTime >= this.idleTolerance
        && this.idleTolerance >= -1
        && !this.menuVisible) {
          this.menuVisible = true;
          console.info('MenuBar on idle');
        }
    }, 1000);
    console.info('Idle tracking enabled');
  }

  // handles the open and close of the sidebar
  toggleMenuBar(visible:boolean|null = null): void {
    this.menuVisible = visible == null
      ? !this.menuVisible
      : visible;
  }
}
