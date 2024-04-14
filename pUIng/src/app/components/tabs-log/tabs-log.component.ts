import { Component, ElementRef, ViewChild } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { NewLogSectionComponent } from './new-log-section/new-log-section.component';
import { LogDayComponent } from "./log-day/log-day.component";
import { CommonModule, NgForOf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
  ]
})
export class TabsLogComponent {

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  uiStateService: UiStateService
  route: ActivatedRoute
  router: Router
  highlightedTask: number = -1

  constructor(
    uiStateService: UiStateService,
    route: ActivatedRoute,
    router: Router
  ) {
    this.uiStateService = uiStateService
    this.route = route
    this.router = router
  }

  ngOnInit() {
    var task = Number.parseInt(this.route.snapshot.paramMap.get('task') ?? '0');
    if (task) {
      this.flashTask(task)
    } else {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: "smooth" })
    }
  }
  
  ngAfterViewInit() {
  }

  flashTask(taskId: number) {
    this.highlightedTask = taskId
    setTimeout(() => { this.highlightedTask = -1 }, 5000);
  }
}
