import { Component, Input } from '@angular/core';
import { TaskLog } from '../../../../../models/task-log.model';
import { Task } from '../../../../../models/task.model';
import { UiStateService } from '../../../../../services/ui-state.service';
import { EditableItemComponent } from "../../../../../common/editable-item/editable-item.component";
import { TaskStatus } from '../../../../../task-status';

@Component({
  selector: 'pui-task-row',
  standalone: true,
  templateUrl: './task-row.component.html',
  styleUrl: './task-row.component.css',
  imports: [EditableItemComponent]
})
export class TaskRowComponent {

  @Input() taskId!: number;
  @Input() taskLog!: TaskLog;
  task?: Task;
  uiStateService!: UiStateService;
  taskStatus!: TaskStatus;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }

  ngOnInit() {
    this.task = this.uiStateService.getTask(this.taskId) // TODO: ng if task not found ?
    this.taskStatus = this.taskLog.statusId
  }
}
