import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EditableItemComponent } from '../../../../common/editable-item/editable-item.component';
import { Project } from '../../../../models/project.model';
import { TaskLog } from '../../../../models/task-log.model';
import { UiStateService } from '../../../../services/ui-state.service';
import { TaskRowComponent } from "./task-row/task-row.component";

@Component({
    selector: 'pui-project-row',
    standalone: true,
    templateUrl: './project-row.component.html',
    styleUrl: './project-row.component.css',
    imports: [TaskRowComponent, CommonModule, EditableItemComponent]
})
export class ProjectRowComponent {

  @Input() projectId!: number
  @Input() tree!: Map<number, TaskLog>
  project?: Project
  uiStateService!: UiStateService

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }

  ngOnInit() {
    this.project = this.uiStateService.getProject(this.projectId) // TODO: ng if service error
    console.log(this.uiStateService, 'uistateservice')
  }

}
