import { Component, Input, OnInit } from '@angular/core';
import { EditableItemComponent } from '../../../../common/editable-item/editable-item.component';
import { TaskStatus } from '../../../../common/task-status';
import { Task } from '../../../../models/task.model';
import { UiStateService } from '../../../../services/ui-state.service';

@Component({
  selector: 'pui-project-task',
  standalone: true,
  imports: [EditableItemComponent],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})
export class ProjectTaskComponent implements OnInit {

  @Input() taskId!: number
  @Input() statusId!: number
  uiStateService!: UiStateService
  task?: Task
  taskStatus?: TaskStatus

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }

  ngOnInit() {
    this.task = this.uiStateService.getTask(this.taskId) // TODO : ng error
    this.taskStatus = this.statusId
  }
}
