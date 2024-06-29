import { afterNextRender, Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { LoaderComponent } from '../../common/loader/loader.component';
import { ExportButtonState } from '../../common/export-button-state';

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
export class MainMenuComponent {

  uiStateService: UiStateService;

  appLoadPercent: number = 0;
  loadStateObserver: Subscription;
  
  menuVisible: boolean = true;
  ebs = ExportButtonState;
  exportButtonState = ExportButtonState.Idle;
  flashedButton: string = "";

  idleTime: number = 0;
  idleTolerance: number = 500;

  constructor(uistateService: UiStateService, private router: Router) {
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

    afterNextRender(() => {
      this.enableIdleTracking();
    });
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
  toggleMenuBar(visibility:boolean|null = null): void {
    this.menuVisible = visibility == null
      ? !this.menuVisible
      : visibility;
  }

  @HostListener('window:keydown.shift.m', ['$event'])
  MenuBarShortcut(event: Event): void {
    event.preventDefault();
    this.toggleMenuBar()
  }

  @HostListener('window:keydown.shift.l', ['$event', '"/logs"'],)
  @HostListener('window:keydown.shift.p', ['$event', '"/projects"'],)
  @HostListener('window:keydown.shift.h', ['$event', '"/habits"'],)
  TabShortcut(event: Event, page:string): void {

    event.preventDefault();
    this.flashedButton = page
    this.toggleMenuBar(true);
    setTimeout(() => {
      this.router.navigate([page]);
      this.toggleMenuBar(false);
      setTimeout(() => { this.flashedButton = ''; }, 500);
    }, 500);
  }

  exportData(target: HTMLElement) {
    const messageShowDuration = 2000;
    this.toggleMenuBar();
    this.exportButtonState = this.ebs.Waiting;

    this.uiStateService.exportData().then(
      (res: any) => {
        this.exportButtonState = (res == true)
          ? this.ebs.Success 
          : this.ebs.Failure;
        // TODO: standardize responses
        // TODO: notifications
        switch (res) {
          case true:
            this.exportButtonState = this.ebs.Success;
            target.title = "Export Complete";
            break;
          case false:
            this.exportButtonState = this.ebs.Failure;
            target.title = "the previous export action was cancelled";
            break;
          case "noAccess":
            this.exportButtonState = this.ebs.Failure;
            target.title = "proTracker doesn't have access to the file at the moment";
            break;
          case "exportException":
            this.exportButtonState = this.ebs.Failure;
            target.title = "an unhandled error occurred";
            break;
          default:
            this.exportButtonState = this.ebs.Idle;
            target.title = "";
            break;
        }
        setTimeout(() => {
          this.exportButtonState = this.ebs.Idle;
        }, messageShowDuration);
      },
      (err: any) => {
        target.title = "Fatal error";
        this.exportButtonState = this.ebs.Failure;
        console.error('Unhandled Error occurred on Data Export', err);

        setTimeout(() => {
          this.exportButtonState = this.ebs.Idle;
        }, messageShowDuration);
      }
    );
  }
}
