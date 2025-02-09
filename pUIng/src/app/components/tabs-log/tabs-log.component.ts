import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { NewLogSectionComponent } from './new-log-section/new-log-section.component';
import { LogDayComponent } from "./log-day/log-day.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectAutoTypeService } from '../../services/project-auto-type.service';
import { NewLogShortcutService } from '../../services/new-log-shortcut.service';

@Component({
  selector: 'pui-tabs-log',
  standalone: true,
  templateUrl: './tabs-log.component.html',
  styleUrl: './tabs-log.component.css',
  imports: [
    NewLogSectionComponent,
    LogDayComponent,
    CommonModule,
  ],
  providers: [
    ProjectAutoTypeService,
  ]
})
export class TabsLogComponent implements OnInit {

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  @Input() task?: number;
  uiStateService: UiStateService;
  router: Router;
  highlightedTask: number = -1;

  constructor(
    uiStateService: UiStateService,
    router: Router,
    private renderer: Renderer2,
    private newLogShortcutService: NewLogShortcutService,
  ) {
    this.uiStateService = uiStateService;
    this.router = router;
  }

  ngOnInit() {
    if (this.task) this.flashTask(this.task);
    this.scrollTaskIntoView(this.task ?? -1);
  }

  @HostListener('window:keydown.alt.shift.n', ['$event'])
  newLogShortcut(event?: Event): void {
    if (!this.uiStateService.shortcutsEnabled) {
      return;
    }
    event?.preventDefault();
    this.newLogShortcutService.requestFocus();
  }

  scrollTaskIntoView(task: number) {
    setTimeout(() => {
      if (task == -1) {
        this.scrollAnchor.nativeElement.scrollIntoView({ behavior: "smooth" });
      } else {
        const taskElement = this.renderer.selectRootElement(`#task_row_${task}`, true);
        if (taskElement) {
          taskElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  flashTask(taskId: number) {
    this.highlightedTask = taskId;
    setTimeout(() => { this.highlightedTask = -1 }, 5000);
  }
}
