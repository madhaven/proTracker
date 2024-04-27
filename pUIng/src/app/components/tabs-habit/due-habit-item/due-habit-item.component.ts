import { Component, Input } from '@angular/core';
import { Habit } from '../../../models/habit.model';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'pui-due-habit-item',
  standalone: true,
  imports: [],
  templateUrl: './due-habit-item.component.html',
  styleUrl: './due-habit-item.component.css'
})
export class DueHabitItemComponent {

  @Input() habitId!: number;
  @Input() habit!: Habit;
  uiStateService: UiStateService;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
  }

  habitLog() {
    this.uiStateService.markHabitDone(this.habit);
  }
}
