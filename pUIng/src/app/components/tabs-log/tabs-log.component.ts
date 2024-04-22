import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { NewLogSectionComponent } from './new-log-section/new-log-section.component';
import { LogDayComponent } from "./log-day/log-day.component";
import { CommonModule, NgForOf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
export class TabsLogComponent implements OnInit, AfterViewInit {

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
    this.scrollIntoView()
  }
  
  ngAfterViewInit() {
    this.scrollIntoView()
  }

  scrollIntoView() {
    var task = Number.parseInt(this.route.snapshot.paramMap.get('task') ?? '0');
    if (task) {
      this.flashTask(task)
    } else {
      try {
        this.scrollAnchor.nativeElement.scrollIntoView({ behavior: "smooth" })
      } catch {
        ;
      }
    }
  }

  flashTask(taskId: number) {
    this.highlightedTask = taskId
    setTimeout(() => { this.highlightedTask = -1 }, 5000);
  }
}
