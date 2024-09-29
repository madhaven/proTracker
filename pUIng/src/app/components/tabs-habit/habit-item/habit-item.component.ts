import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EditableItemComponent } from '../../../common/editable-item/editable-item.component';
import { Habit } from '../../../models/habit.model';
import { UiStateService } from '../../../services/ui-state.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'pui-habit-item',
  standalone: true,
  imports: [
    EditableItemComponent,
    NgIf,
    BaseChartDirective,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()) // minimize bundle with specific components
  ],
  templateUrl: './habit-item.component.html',
  styleUrl: './habit-item.component.css'
})
export class HabitItemComponent implements OnInit {

  @Input() habitId!: number;
  @Input() habit!: Habit;
  today: Date = new Date();
  uiStateService: UiStateService;
  
  chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Steps",
        data: [1, 4, 3, 4, 5, 2, 7]
      }
    ]
  }

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
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
