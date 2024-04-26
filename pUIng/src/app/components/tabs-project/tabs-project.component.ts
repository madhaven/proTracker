import { Component } from '@angular/core';
import { ProjectItemComponent } from './project-item/project-item.component';
import { UiStateService } from '../../services/ui-state.service';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'pui-tabs-project',
  standalone: true,
  imports: [
    ProjectItemComponent,
    NgForOf,
    CommonModule,
  ],
  templateUrl: './tabs-project.component.html',
  styleUrl: './tabs-project.component.css'
})
export class TabsProjectComponent {

  uiStateService!: UiStateService

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }
}
