import { Component, Input } from '@angular/core';

@Component({
  selector: 'pui-new-log-section',
  standalone: true,
  imports: [],
  templateUrl: './new-log-section.component.html',
  styleUrl: './new-log-section.component.css'
})
export class NewLogSectionComponent {

  @Input() logsExist:boolean = false

}
