import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { UiStateService } from '../../../services/ui-state.service';
import { HabitMetricsService } from '../../../services/habit-metrics.service';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';

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
  
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  uiStateService: UiStateService;
  habitService: HabitMetricsService;
  activityStart: number = 0;

  // default chart data
  chartData: ChartData = {
    labels: ["day1", "day2"],
    datasets: [{ label: "sample", data: [0, 1, 2], tension: 0.3 }]
  };
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {y: {display: false}},
    elements: {
      line: {borderWidth: 2},
      point: {pointStyle: false}
    }
  }

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
    this.populateGraph();
  }
  
  populateGraph(): void {
    this.activityStart = this.habitService.getActivityStart();
    this.setGraphDates();
    this.chartData.datasets = [];
    for (var [id, habit] of this.uiStateService.habits) {
      var mappedData = this.habitService
        .getHabitStreakMap(habit, this.activityStart, 2)
        .values();
      var dataset: ChartDataset = {
        label: habit.name,
        data: Array.from(mappedData),
        tension: 0.5,
      }
      this.chartData.datasets.push(dataset);
    }
    this.chart?.update();
  }

  setGraphDates(): void {
    var oneDay = 24 * 60 * 60 * 1000;
    this.chartData.labels = [];
    for (var time=this.activityStart; time <= Date.now(); time += oneDay) {
      var date = new Date(time);
      this.chartData.labels.push(date.toString().slice(0, 15));
    }

  }
}
