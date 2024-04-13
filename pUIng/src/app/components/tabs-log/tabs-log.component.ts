import { Component, ElementRef, ViewChild } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';
import { NewLogSectionComponent } from './new-log-section/new-log-section.component';
import { LogDayComponent } from "./log-day/log-day.component";
import { CommonModule, NgForOf } from '@angular/common';

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

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }

  ngAfterViewInit() {
    this.scrollAnchor.nativeElement.scrollIntoView({ behavior: "smooth" })
  }
}
