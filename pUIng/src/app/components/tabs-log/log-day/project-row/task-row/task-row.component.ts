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
  statusOnUi!: TaskStatus;

  private clickTimer?: number;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
    this.stateObserver = this.uiStateService.stateChanged$.subscribe((newState) => {
      this.uiStateService = newState;
      this.task = this.uiStateService.getTask(this.taskId);
    });
  }

  ngOnInit() {
    this.task = this.uiStateService.getTask(this.taskId); // TODO: ng if task not found ?
    this.statusOnUi = this.taskLog.statusId;
  }

  taskClick() {
    // TODO: setup more refined status change mechanism
    if (!this.itIsToday) return;
    
    var newTaskStatus;
    switch (this.statusOnUi) {
      case TaskStatus.PENDING:
        newTaskStatus = TaskStatus.IN_PROGRESS;
        break;
      case TaskStatus.IN_PROGRESS:
        newTaskStatus = TaskStatus.COMPLETED;
        break;
      case TaskStatus.COMPLETED:
      default:
        newTaskStatus = TaskStatus.PENDING;
        break;
    }

    this.statusOnUi = newTaskStatus;
    this.uiStateService.toggleTask(this.taskLog.taskId, newTaskStatus, Date.now());
  }

  taskEdit(newName: string) {
    var newTask = {...this.task!}
    newTask.summary = newName
    this.uiStateService.editTask(newTask);
  }
}
