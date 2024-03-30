import { Component, Input } from '@angular/core';
import { TaskLog } from '../../../../../models/task-log.model';
import { Task } from '../../../../../models/task.model';
import { UiStateService } from '../../../../../services/ui-state.service';

@Component({
  selector: 'pui-task-row',
  standalone: true,
  imports: [],
  templateUrl: './task-row.component.html',
  styleUrl: './task-row.component.css'
})
export class TaskRowComponent {

  @Input() taskId!: number
  @Input() taskLog!: TaskLog
  task?: Task
  uiStateService!: UiStateService;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }

  ngOnInit() {
    this.task = this.uiStateService.getTask(this.taskId) // TODO: ng if task not found ?
  }
}
