import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EditableItemComponent } from '../../../common/editable-item/editable-item.component';
import { Habit } from '../../../models/habit.model';
import { UiStateService } from '../../../services/ui-state.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'pui-habit-item',
  standalone: true,
  imports: [
    EditableItemComponent,
    NgIf,
  ],
  templateUrl: './habit-item.component.html',
  styleUrl: './habit-item.component.css'
})
export class HabitItemComponent implements OnInit {

  @Input() habitId!: number;
  @Input() habit!: Habit;
  today: Date = new Date();
  uiStateService: UiStateService;
  
  chart: any;
  chartConfig: any;
  @ViewChild('lineChart') chartRef!: ElementRef;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
    Chart.register(...registerables)
    this.chartConfig = {
      type: 'line',
      options: {},
      data: {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [
          {
            label: "Steps",
            data: [1, 2, 3, 4, 5, 6, 7]
          }
        ]
      }
    }
  }

  ngOnInit() {
    this.today = new Date();
    setTimeout(() => {
      this.chart = new Chart(this.chartRef.nativeElement, this.chartConfig)
    });
  }

  editHabit(newName: string) {
    var newHabit = {...this.habit};
    newHabit.name = newName;
    this.uiStateService.editHabit(newHabit);
  }
}
