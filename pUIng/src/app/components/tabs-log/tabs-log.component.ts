import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { NewLogSectionComponent } from './new-log-section/new-log-section.component';
import { LogDayComponent } from "./log-day/log-day.component";
import { CommonModule, NgForOf } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectAutoTypeService } from '../../services/project-auto-type.service';

@Component({
  selector: 'pui-tabs-log',
  standalone: true,
  templateUrl: './tabs-log.component.html',
  styleUrl: './tabs-log.component.css',
  imports: [
    NewLogSectionComponent,
    LogDayComponent,
    NgForOf,
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
  ) {
    this.uiStateService = uiStateService;
    this.router = router;
  }

  ngOnInit() {
    if (this.task) this.flashTask(this.task);
    this.scrollIntoView(this.task ?? 0);
  }

  scrollIntoView(task: number) {
    setTimeout(() => {
      if (task == 0) {
        this.scrollAnchor.nativeElement.scrollIntoView({ behavior: "smooth" });
      } else {
        document.getElementById("task_row_" + task)?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  flashTask(taskId: number) {
    this.highlightedTask = taskId;
    setTimeout(() => { this.highlightedTask = -1 }, 5000);
  }
}
