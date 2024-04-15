import { Component, Input } from '@angular/core';
import { Habit } from '../../../models/habit.model';

@Component({
  selector: 'pui-due-habit-item',
  standalone: true,
  imports: [],
  templateUrl: './due-habit-item.component.html',
  styleUrl: './due-habit-item.component.css'
})
export class DueHabitItemComponent {

  @Input() habitId!: number
  @Input() habit!: Habit

  habitLog() {
    // TODO: ng service
  }

}
