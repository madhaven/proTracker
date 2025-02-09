import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlurDirective } from '../../../common/blur.directive';
import { Habit } from '../../../models/habit.model';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'pui-due-habit-item',
  standalone: true,
  imports: [
    BlurDirective
  ],
  templateUrl: './due-habit-item.component.html',
  styleUrl: './due-habit-item.component.css'
})
export class DueHabitItemComponent {

  @Input() habitId!: number;
  @Input() habit!: Habit;
  @Output() dueHabitDone = new EventEmitter();
  uiStateService: UiStateService;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
  }

  habitLog(): void {
    this.uiStateService.markHabitDone(this.habit);
    this.uiStateService.notifyStateChange();
    this.dueHabitDone.emit();
  }
}
