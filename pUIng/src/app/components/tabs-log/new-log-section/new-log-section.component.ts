import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NewTask } from '../../../models/new-task.model';
import { ElectronComService } from '../../../services/electron-com.service';
import { ProjectAutoTypeService } from '../../../services/project-auto-type.service';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'pui-new-log-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-log-section.component.html',
  styleUrl: './new-log-section.component.css'
})
export class NewLogSectionComponent {

  @Input() logsExist:boolean = false
  uiStateService: UiStateService
  eComService: ElectronComService
  newProjectValue: string = ''
  newTaskValue: string = ''
  autoTypeListener: Subscription;

  constructor(
    uiStateService: UiStateService,
    eComService: ElectronComService,
    autoTypeService: ProjectAutoTypeService,
  ) {
    this.uiStateService = uiStateService
    this.eComService = eComService

    this.autoTypeListener = autoTypeService.autoTypeRequested$.subscribe(
      projectName => { this.autoTypeProject(projectName) }
    )
  }

  trimInput(target: HTMLInputElement): void {
    target.value = target.value.trimStart()
  }
 
  newTask(target: HTMLInputElement){
    if (!this.newTaskValue || !this.newProjectValue) {
      return
    }

    // content validations
    this.newTaskValue = this.newTaskValue.trim()
    this.newProjectValue = this.newProjectValue.trim()

    var newTask = {
      dateTime: new Date(),
      project: this.newProjectValue,
      summary: this.newTaskValue
    } as NewTask
    
    this.eComService.newTask(newTask).then(
      (res: any) => { // TODO: ng standardise data models
        if (!res) return
        this.uiStateService.newTask(res.log, res.task, res.project)
      },
      (err: any) => {
          console.error('server error while adding new task') // TODO notification
      }
    )

    // reset the input section
    this.newProjectValue = ''
    this.newTaskValue = ''
    target.blur()
  }

  autoTypeProject(projectName: string, index=0) {
    if (index == 0) this.newProjectValue = ''
    if (index >= projectName.length) return
    this.newProjectValue += projectName[index]
    setTimeout(() => { this.autoTypeProject(projectName, index+1) }, 25);
  }
}
