import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TaskLog } from '../../../models/task-log.model';
import { ProjectRowComponent } from "./project-row/project-row.component";

@Component({
    selector: 'pui-log-day',
    standalone: true,
    templateUrl: './log-day.component.html',
    styleUrl: './log-day.component.css',
    imports: [ProjectRowComponent, CommonModule]
})
export class LogDayComponent implements OnInit {

  @Input() logDay: string = "";
  @Input() tree: Map<number, Map<number, TaskLog>> = new Map();
  @Input() highlightedTask: number = -1;
  itIsToday: boolean = false;
  id: number = 0;
  displayDate: string = "";
  
  ngOnInit() {
    const [year, month, day] = this.logDay.split(',').map(x => Number.parseInt(x, 10));
    const t = new Date(year, month, day);
    const itIsToday = new Date().toDateString() == t.toDateString();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    this.id = t.getTime();
    this.itIsToday = itIsToday;
    this.displayDate = itIsToday ? 'Today' : `${year} ${months[month]} ${day}`;
  }
}
