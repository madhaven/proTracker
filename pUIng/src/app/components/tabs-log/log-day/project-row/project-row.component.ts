import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TaskLog } from '../../../../models/task-log.model';
import { TaskRowComponent } from "./task-row/task-row.component";

@Component({
    selector: 'pui-project-row',
    standalone: true,
    templateUrl: './project-row.component.html',
    styleUrl: './project-row.component.css',
    imports: [TaskRowComponent, CommonModule]
})
export class ProjectRowComponent {

  @Input() projectId!: number
  @Input() tree!: Map<number, TaskLog>

}
