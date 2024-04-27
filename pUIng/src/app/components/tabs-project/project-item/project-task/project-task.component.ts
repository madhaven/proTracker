import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EditableItemComponent } from '../../../../common/editable-item/editable-item.component';
import { TaskStatus } from '../../../../common/task-status';
import { Task } from '../../../../models/task.model';
import { UiStateService } from '../../../../services/ui-state.service';

@Component({
  selector: 'pui-project-task',
  standalone: true,
  imports: [EditableItemComponent, RouterModule],
  templateUrl: './project-task.component.html',
  styleUrl: './project-task.component.css'
})
export class ProjectTaskComponent implements OnInit {

  @Input() taskId!: number;
  @Input() statusId!: number;
  uiStateService!: UiStateService;
  task?: Task;
  taskStatus?: TaskStatus;
  router: Router

  constructor(
    uiStateService: UiStateService,
    router: Router,
  ) {
    this.uiStateService = uiStateService;
    this.router = router;
  }

  ngOnInit() {
    this.task = this.uiStateService.getTask(this.taskId); // TODO: ng error
    this.taskStatus = this.statusId;
  }

  taskEdit(newName: string) {
    var newTask = {...this.task!}
    newTask.summary = newName
    this.uiStateService.editTask(newTask)
  }

  redirectToLogs() {
    this.router.navigate(['/logs', this.taskId])
  }
}
