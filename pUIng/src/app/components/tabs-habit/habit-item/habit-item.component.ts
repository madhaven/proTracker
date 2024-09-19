import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EditableItemComponent } from '../../../common/editable-item/editable-item.component';
import { Habit } from '../../../models/habit.model';
import { UiStateService } from '../../../services/ui-state.service';
import { Chart } from 'chart.js'

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

  @ViewChild('lineChart') private chartRef!: ElementRef;
  chart: any;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
  }

  ngOnInit() {
    this.today = new Date();

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            data: [0, 0, 1, 2, 3 ,-1],
            borderColor: '#00AEFF',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true },
          y: { display: true }
        }
      }
    })
  }

  editHabit(newName: string) {
    var newHabit = this.habit;
    newHabit.name = newName;
    this.uiStateService.editHabit(newHabit);
  }
}
