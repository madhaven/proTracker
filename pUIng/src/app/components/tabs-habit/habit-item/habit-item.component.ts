import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { EditableItemComponent } from '../../../common/editable-item/editable-item.component';
import { Habit } from '../../../models/habit.model';
import { UiStateService } from '../../../services/ui-state.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { HabitMetricsService } from '../../../services/habit-metrics.service';

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
  habitService: HabitMetricsService;
  
  chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "",
        data: [0],
        tension: 0.3,
      },
    ],
  };

  constructor(
    uiStateService: UiStateService,
    habitService: HabitMetricsService,
  ) {
    this.uiStateService = uiStateService;
    this.habitService = habitService;

    this.uiStateService.stateChanged$.subscribe(newState => {
      this.uiStateService = newState;
      this.populateGraph();
    });
  }

  ngOnInit() {
    this.today = new Date();
    this.populateGraph();
  }

  populateGraph() {
    var consistancyData = this.habitService.generateDailyFrequency(this.habit);
    this.chartData.datasets[0].data = Array
      .from(consistancyData.values());
    this.chartData.labels = Array
      .from(consistancyData.keys())
      .map(x => x.toString().slice(0, 15));
  }

  editHabit(newName: string) {
    var newHabit = {...this.habit};
    newHabit.name = newName;
    this.uiStateService.editHabit(newHabit);
  }
}
