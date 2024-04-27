import { CommonModule, NgForOf } from '@angular/common';
import { Component, DoCheck } from '@angular/core';
import { HabitItemComponent } from './habit-item/habit-item.component';
import { Habit } from '../../models/habit.model';
import { UiStateService } from '../../services/ui-state.service';
import { NewHabitSectionComponent } from './new-habit-section/new-habit-section.component';
import { DueHabitItemComponent } from './due-habit-item/due-habit-item.component';

@Component({
  selector: 'pui-tabs-habit',
  standalone: true,
  imports: [
    NgForOf,
    CommonModule,
    HabitItemComponent,
    DueHabitItemComponent,
    NewHabitSectionComponent,
  ],
  templateUrl: './tabs-habit.component.html',
  styleUrl: './tabs-habit.component.css'
})
export class TabsHabitComponent implements DoCheck{

  uiStateService!: UiStateService;
  dueHabits!: Map<number, Habit>;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService; // TODO: ng handle errors
    this.dueHabits = this.uiStateService.getHabitsDueOn(new Date());
  }
  
  // ngAfterContentChecked() { // working too frequently
  ngDoCheck() { // TODO: working too frequently - make dueHabits item in stateservice
    this.dueHabits = this.uiStateService.getHabitsDueOn(new Date());
  }
}
