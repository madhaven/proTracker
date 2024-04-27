import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'pui-new-habit-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-habit-section.component.html',
  styleUrl: './new-habit-section.component.css'
})
export class NewHabitSectionComponent {

  newHabitName?: string;
  newHabitFrequency?: number;
  uiStateService!: UiStateService;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
  }

  newHabit(element: HTMLInputElement) {
    if (!this.newHabitName
      || !this.newHabitFrequency
      || this.newHabitName!.length < 1
      || this.newHabitFrequency! < 1
      || this.newHabitFrequency! > 7
    ) return;

    this.uiStateService.newHabit(this.newHabitName!, this.newHabitFrequency!);

    // reset UI
    this.newHabitName = this.newHabitFrequency = undefined;
    element.blur();
  }
}