import { CommonModule, NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditableItemComponent } from '../../../common/editable-item/editable-item.component';
import { Project } from '../../../models/project.model';
import { UiStateService } from '../../../services/ui-state.service';
import { ProjectTaskComponent } from './project-task/project-task.component';

@Component({
  selector: 'pui-project-item',
  standalone: true,
  imports: [
    EditableItemComponent,
    ProjectTaskComponent,
    CommonModule,
    NgForOf,
    RouterLink,
  ],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.css'
})
export class ProjectItemComponent implements OnInit {

  @Input() projectId!: number;
  @Input() taskTree!: Map<number, number>;
  project?: Project;
  uiStateService!: UiStateService;
  stateObserver: Subscription;
  foldedProject!: boolean;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
    this.stateObserver = this.uiStateService.stateChanged$.subscribe((newState) => {
      this.uiStateService = newState;
      this.project = this.uiStateService.getProject(this.projectId);
    });
  }

  ngOnInit() {
    this.project = this.uiStateService.getProject(this.projectId); // TODO: else throw error
    this.foldedProject = this.taskTree.size == 0 || (this.uiStateService.foldedProjects.get(this.projectId) ?? false);
  }

  foldProject() {
    this.foldedProject = this.uiStateService.toggleFold(this.projectId);
  }

  editProject(newName: string) {
    var newProject = {...this.project!}
    newProject.name = newName
    this.uiStateService.editProject(newProject);
  }
}
