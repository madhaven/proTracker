import { CommonModule, NgForOf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { HabitItemComponent } from './habit-item/habit-item.component';
import { Habit } from '../../models/habit.model';
import { UiStateService } from '../../services/ui-state.service';
import { NewHabitSectionComponent } from './new-habit-section/new-habit-section.component';
import { DueHabitItemComponent } from './due-habit-item/due-habit-item.component';
import { Subscription } from 'rxjs';
import { NewHabitShortcutService } from '../../services/new-habit-shortcut.service';
import { HabitGraphComponent } from "./habit-graph/habit-graph.component";

@Component({
  selector: 'pui-tabs-habit',
  standalone: true,
  imports: [
    NgForOf,
    CommonModule,
    HabitItemComponent,
    DueHabitItemComponent,
    NewHabitSectionComponent,
    HabitGraphComponent
],
  templateUrl: './tabs-habit.component.html',
  styleUrl: './tabs-habit.component.css'
})
export class TabsHabitComponent {

  uiStateService!: UiStateService;
  stateObserver: Subscription;
  dueHabits!: Map<number, Habit>;

  constructor(
    uiStateService: UiStateService,
    private newHabitShortcutService: NewHabitShortcutService,
  ) {
    this.uiStateService = uiStateService; // TODO: ng handle errors
    this.dueHabits = this.uiStateService.getHabitsDueOn(new Date());
    this.stateObserver = this.uiStateService.stateChanged$.subscribe((newState) => {
      this.uiStateService = newState;
      this.dueHabits = this.uiStateService.getHabitsDueOn(new Date());
    });
  }

  @HostListener('window:keydown.alt.shift.n', ['$event'])
  newHabitShortcut(event?: Event): void {
    if (!this.uiStateService.shortcutsEnabled) {
      return;
    }
    event?.preventDefault();
    this.newHabitShortcutService.requestFocus();
  }
}
