import { Component, Input, OnInit } from '@angular/core';
import { EditableItemComponent } from '../../../common/editable-item/editable-item.component';
import { Habit } from '../../../models/habit.model';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'pui-habit-item',
  standalone: true,
  imports: [
    EditableItemComponent
],
  templateUrl: './habit-item.component.html',
  styleUrl: './habit-item.component.css'
})
export class HabitItemComponent implements OnInit {

  @Input() habitId!: number;
  @Input() habit!: Habit;
  today: Date = new Date();
  uiStateService: UiStateService;

  constructor(
    uiStateService: UiStateService,
  ) {
    this.uiStateService = uiStateService;
    this.uiStateService.stateChanged$.subscribe(newState => {
      this.uiStateService = newState;
    });
  }

  ngOnInit() {
    this.today = new Date();
  }

  editHabit(newName: string) {
    var newHabit = {...this.habit};
    newHabit.name = newName;
    this.uiStateService.editHabit(newHabit);
  }
}
