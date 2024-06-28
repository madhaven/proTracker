import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NewTaskData } from '../../../models/new-task-data.model';
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

  @Input() logsExist:boolean = false;
  @ViewChild('newLogTask') newTaskInput!: ElementRef;
  uiStateService: UiStateService;
  eComService: ElectronComService;
  newProjectValue: string = '';
  newTaskValue: string = '';
  autoTypeListener: Subscription;

  constructor(
    uiStateService: UiStateService,
    eComService: ElectronComService,
    autoTypeService: ProjectAutoTypeService,
  ) {
    this.uiStateService = uiStateService;
    this.eComService = eComService;

    this.autoTypeListener = autoTypeService.autoTypeRequested$.subscribe(
      projectName => { this.autoTypeProject(projectName); }
    )
  }

  trimInput(target: HTMLInputElement): void {
    target.value = target.value.trimStart();
  }
 
  newTask(target: HTMLInputElement){
    if (!this.newTaskValue || !this.newProjectValue) {
      return;
    }

    // content validations
    this.newTaskValue = this.newTaskValue.trim();
    this.newProjectValue = this.newProjectValue.trim();

    var newTask = new NewTaskData(-1, new Date().getTime(), this.newProjectValue, this.newTaskValue);
    this.uiStateService.newTask(newTask);

    // reset the input section
    this.newProjectValue = '';
    this.newTaskValue = '';
    target.blur();
  }

  autoTypeProject(projectName: string, index=0) {
    if (index == 0) this.newProjectValue = '';
    if (index >= projectName.length) {
      this.newTaskInput.nativeElement.focus();
      return;
    }
    this.newProjectValue += projectName[index];
    setTimeout(() => { this.autoTypeProject(projectName, index+1) }, 25);
  }
}
