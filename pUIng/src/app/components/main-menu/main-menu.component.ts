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

  appLoadPercent: number = 0;
  loadStateObserver: Subscription;
  
  menuVisible: boolean = true;
  ebs = ExportButtonState;
  exportButtonState = ExportButtonState.Idle;
  flashedButton: string = "";

  idleTime: number = 0;
  idleTolerance: number = 500;

  constructor(
    protected uiStateService: UiStateService,
    private router: Router,
  ) {
    this.idleTolerance = this.uiStateService.idleTolerance;
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
    ['mousemove', 'mousedown', 'drag', 'keypress', 'keydown', 'scroll'].forEach(event => {
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

  @HostListener('window:keydown.alt.shift.m', ['$event'])
  menuBarShortcut(event?: Event): void {
    if (!this.uiStateService.shortcutsEnabled) {
      return;
    }
    event?.preventDefault();
    this.toggleMenuBar();
  }

  @HostListener('window:keydown.alt.shift.l', ['"/logs"', '$event'],)
  @HostListener('window:keydown.alt.shift.p', ['"/projects"', '$event'],)
  @HostListener('window:keydown.alt.shift.h', ['"/habits"', '$event'],)
  tabShortcut(page:string, event?: Event): void {
    if (!this.uiStateService.shortcutsEnabled) {
      return;
    }
    event?.preventDefault();
    this.flashedButton = page;
    this.toggleMenuBar(true);
    setTimeout(() => {
      this.router.navigate([page]);
      this.toggleMenuBar(false);
      setTimeout(() => { this.flashedButton = ''; });
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
