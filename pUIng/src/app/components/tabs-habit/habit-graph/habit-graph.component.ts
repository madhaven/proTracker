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
    scales: {
      y: {
        grid: {color: '#fff', lineWidth: 0.1},
        ticks: {stepSize: 1}
      }
    },
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
      console.log('state update graph update');
      this.populateGraph();
    });
  }

  ngOnInit() {
    console.log('initingGraph');
    this.populateGraph();
  }

  createDataset(label: string, data: number[], tension: number = 0.5, fill: string = 'origin'): ChartDataset {
    return { label: label, data: data, tension: tension, fill: fill };
  }
  
  populateGraph(): void {
    console.log('populating graph');
    this.activityStart = this.habitService.getActivityStart();
    var labelMap = this.setGraphDates(this.activityStart);

    this.chartData.datasets = [];
    for (var [id, habit] of this.uiStateService.habits) {
      var freqMap = this.habitService.getHabitFrequencyMap(habit, this.activityStart);
      var streakMap = this.habitService.getHabitStreakMap(habit, this.activityStart, 2);
      var dataset = this.createDataset(habit.name, Array.from(streakMap.values()));
      this.chartData.datasets.push(dataset);
      
      // validation
      freqMap.forEach((freq, date) => {
        if (!labelMap.has(date)) { console.log('labels dont have freqdate', date); }
      })
      streakMap.forEach((freq, date) => {
        if (!labelMap.has(date)) { console.log('labels dont have streakdate', date); }
      })
      labelMap.forEach((x, date) => {
        if (!freqMap.has(date)) { console.log('freqMap dont have', date); }
        if (!streakMap.has(date)) { console.log('streakMap dont have', date); }
      })

    }
    this.chart?.update();
    
    // internal validation
    var graphLabelCount = this.chartData.labels?.length;
    this.chartData.datasets.forEach(dataset => {
      var datasetLength = dataset.data.length;
      if (datasetLength != graphLabelCount) {
        console.log(dataset.label, 'point Count', datasetLength, '!=', graphLabelCount);
      }
    });
  }

  setGraphDates(activityStart: number): Map<Date, number> {
    var oneDay = 24 * 60 * 60 * 1000;
    this.chartData.labels = [];
    var labelMap = new Map<Date, number>();
    for (var time=activityStart; time <= Date.now(); time += oneDay) {
      var date = new Date(time);
      this.chartData.labels.push(date.toString().slice(0, 15));
      labelMap.set(date, 0);
    }
    return labelMap;
  }

  graphHover(event: any): void {
    console.log('hover', event);
  }

  // graphData(event: ChartEvent): void {
  //   console.log('data', event);
  // }

  // graphClick(event: ChartEvent): void {
  //   console.log('click', event);
  // }
}
