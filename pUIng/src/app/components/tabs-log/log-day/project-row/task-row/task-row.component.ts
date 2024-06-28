import { Component, Input, OnInit } from '@angular/core';
import { TaskLog } from '../../../../../models/task-log.model';
import { Task } from '../../../../../models/task.model';
import { UiStateService } from '../../../../../services/ui-state.service';
import { EditableItemComponent } from "../../../../../common/editable-item/editable-item.component";
import { TaskStatus } from '../../../../../common/task-status';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pui-task-row',
  standalone: true,
  templateUrl: './task-row.component.html',
  styleUrl: './task-row.component.css',
  imports: [EditableItemComponent]
})
export class TaskRowComponent implements OnInit {

  @Input() taskId!: number;
  @Input() taskLog!: TaskLog;
  @Input() highlightedTask: number = -1;
  @Input() itIsToday: boolean = false;
  task?: Task;
  uiStateService!: UiStateService;
  stateObserver: Subscription;
  taskStatus!: TaskStatus;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
    this.stateObserver = this.uiStateService.stateChanged$.subscribe((newState) => {
      this.uiStateService = newState;
      this.task = this.uiStateService.getTask(this.taskId);
    });
  }

  ngOnInit() {
    this.task = this.uiStateService.getTask(this.taskId); // TODO: ng if task not found ?
    this.taskStatus = this.taskLog.statusId;
  }

  taskClick() {
    // TODO: setup more refined status change mechanism
    const currentTime = Date.now();
    var newState: TaskStatus = this.taskLog.statusId == TaskStatus.PENDING
        ? TaskStatus.COMPLETED
        : TaskStatus.PENDING;
    if (this.itIsToday)
      this.uiStateService.toggleTask(this.taskLog.taskId, newState, currentTime);
  }

  taskEdit(newName: string) {
    var newTask = {...this.task!}
    newTask.summary = newName
    this.uiStateService.editTask(newTask);
  }
}
