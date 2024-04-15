import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewTask } from '../../../models/new-task.model';

@Component({
  selector: 'pui-new-log-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-log-section.component.html',
  styleUrl: './new-log-section.component.css'
})
export class NewLogSectionComponent {

  @Input() logsExist:boolean = false
  newProjectValue: string = ''
  newTaskValue: string = ''

  trimInput(target: HTMLInputElement, leftOrRight: boolean): void {
    target.value = leftOrRight
      ? target.value.trim()
      : target.value.trimStart()
  }
 
  newTask(){
    if (!this.newTaskValue || !this.newProjectValue) {
      console.log('project / task value invalid')
      return
    }

  // TODO : ng new task logic
}
