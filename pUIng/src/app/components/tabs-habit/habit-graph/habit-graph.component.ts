import { Component } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { UiStateService } from '../../../services/ui-state.service';
import { HabitMetricsService } from '../../../services/habit-metrics.service';

@Component({
  selector: 'pui-habit-graph',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables()) // minimize bundle with specific components
  ],
  templateUrl: './habit-graph.component.html',
  styleUrl: './habit-graph.component.css'
})
export class HabitGraphComponent {
  
  uiStateService: UiStateService;
  habitService: HabitMetricsService;
  today: Date = new Date();

  // default chart data
  chartData = {
    labels: ["habit1", "habit2"],
    datasets: [
      {
        label: "",
        data: [0],
        tension: 0.3,
      }
    ]
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
    console.log('populating graph')
    this.chartData.datasets = []
    for (var [id, habit] of this.uiStateService.habits) {
      // console.log(habit)
      var consistancyData = this.habitService.generateDailyFrequency(habit);
      var dataset = {
        label: habit.name,
        data: Array.from(consistancyData.values()),
        tension: 0.3,
      }
      this.chartData.datasets.push(dataset)
      // this.chartData.labels = Array
      //   .from(consistancyData.keys())
      //   .map(x => x.toString().slice(0, 15));
    }

  }
}
