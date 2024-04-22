import { CommonModule, NgForOf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
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
    RouterLink
  ],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.css'
})
export class ProjectItemComponent implements OnInit {

  @Input() projectId!: number
  @Input() taskTree!: Map<number, number>
  @Output() fold = new EventEmitter()
  project?: Project
  uiStateService!: UiStateService

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }

  ngOnInit() {
    this.project = this.uiStateService.getProject(this.projectId) // TODO ng else throw error
  }

  foldProject() {
    this.fold.emit()
  }

  editProject(newName: string) {
    this.uiStateService.editProject(this.project!.id, newName)
  }
}
