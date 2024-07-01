import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NewHabitShortcutService } from '../../../services/new-habit-shortcut.service';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'pui-new-habit-section',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-habit-section.component.html',
  styleUrl: './new-habit-section.component.css'
})
export class NewHabitSectionComponent {

  @ViewChild('newHabitNameInput') newHabitInput!: ElementRef;
  newHabitName?: string;
  newHabitFrequency?: number;
  uiStateService!: UiStateService;
  newHabitShortcutListener: Subscription;

  constructor(
    uiStateService: UiStateService,
    private newHabitShortcutService: NewHabitShortcutService,
  ) {
    this.uiStateService = uiStateService;
    this.newHabitShortcutListener = newHabitShortcutService.newHabitFocusTriggered$.subscribe(
      () => { this.focusOnHabitField(); }
    );
  }

  // TODO: abstract into interface ?
  focusOnHabitField() {
    this.newHabitInput.nativeElement.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      this.newHabitInput.nativeElement.focus();
    }, 500);
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