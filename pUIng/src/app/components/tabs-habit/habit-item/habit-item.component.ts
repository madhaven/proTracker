import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EditableItemComponent } from '../../../common/editable-item/editable-item.component';
import { Habit } from '../../../models/habit.model';

@Component({
  selector: 'pui-habit-item',
  standalone: true,
  imports: [
    EditableItemComponent,
    NgIf,
  ],
  templateUrl: './habit-item.component.html',
  styleUrl: './habit-item.component.css'
})
export class HabitItemComponent {

  @Input() habitId!: number
  @Input() habit!: Habit
  today: Date = new Date()

  ngOnInit() {
    this.today = new Date()
  }

}
