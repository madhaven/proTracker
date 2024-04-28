import { Component, OnChanges, OnInit } from '@angular/core';
import { ProjectItemComponent } from './project-item/project-item.component';
import { UiStateService } from '../../services/ui-state.service';
import { CommonModule, NgForOf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pui-tabs-project',
  standalone: true,
  imports: [
    ProjectItemComponent,
    NgForOf,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './tabs-project.component.html',
  styleUrl: './tabs-project.component.css'
})
export class TabsProjectComponent implements OnInit {

  uiStateService!: UiStateService;
  sortedProjects!: [number, Map<number, number>][];
  stateObserver: Subscription;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
    this.stateObserver = this.uiStateService.stateChanged$.subscribe((newState) => {
      this.uiStateService = newState;
      this.sortProjects();
    });
  }

  ngOnInit() {
    this.sortProjects();
    setTimeout(() => { this.sortProjects() });
  }

  sortProjects() {
    var projectTreeEntries = this.uiStateService.getProjectTree().entries();
    var arr = Array.from(projectTreeEntries);
    arr.sort((a, b) => {
      const A = this.uiStateService.getProject(a[0]);
      const B = this.uiStateService.getProject(b[0]);
      return A!.name.localeCompare(B!.name) ?? 0;
    })
    this.sortedProjects = arr;
  }
}
