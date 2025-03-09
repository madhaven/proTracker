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

  // default chart data
  chartData: ChartData = {
    labels: ["day1", "day2"],
    datasets: [{ label: "sample", data: [0, 1, 2], tension: 0.3 }]
  };
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        grid: {color: '#fff', lineWidth: 0.1},
        ticks: {stepSize: 1}
      }
    },
    elements: {
      line: {borderWidth: 1},
      point: {pointStyle: false}
    },
    aspectRatio: 3
  }

  constructor(
    uiStateService: UiStateService,
    habitService: HabitMetricsService,
  ) {
    this.uiStateService = uiStateService;
    this.habitService = habitService;
    this.uiStateService.stateChanged$.subscribe(newState => {
      this.uiStateService = newState;
      console.log('state update graph update');
      this.populateGraph();
    });
  }

  ngOnInit() {
    console.log('initingGraph');
    this.populateGraph();
  }

  createDataset(label: string, data: number[], tension: number = 0.5, fill: string = 'none'): ChartDataset {
    return { label: label, data: data, tension: tension, fill: fill};
  }
  
  populateGraph(): void {
    console.log('populating graph');
    var activityStart = this.habitService.getActivityStart();
    var labelMap = this.setGraphDates(activityStart);

    this.chartData.datasets = [];
    for (var [id, habit] of this.uiStateService.habits) {
      var streakMap = this.habitService.getHabitStreakMap(habit, labelMap, 10);
      var dataset = this.createDataset(habit.name, Array.from(streakMap.values()));
      this.chartData.datasets.push(dataset);
    }
    this.chart?.update();
  }

  setGraphDates(activityStart: number): Map<number, number> {
    var oneDay = 24 * 60 * 60 * 1000;
    this.chartData.labels = [];
    var dateMap = new Map<number, number>();
    var startDate = HabitMetricsService.getDayStartTime(activityStart);
    for (var time=startDate; time <= Date.now(); time += oneDay) {
      var date = new Date(time);
      this.chartData.labels.push(date.toString().slice(0, 15));
      dateMap.set(time, 0);
    }
    return dateMap;
  }

  graphHover(event: any): void {
    // console.log('hover', event);
  }

  // graphData(event: ChartEvent): void {
  //   console.log('data', event);
  // }

  // graphClick(event: ChartEvent): void {
  //   console.log('click', event);
  // }
}
