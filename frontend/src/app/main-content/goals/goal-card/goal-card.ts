import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Goal, GoalStats, TaskStatus } from '@models';

@Component({
  selector: 'pt-goal-card',
  imports: [DatePipe],
  templateUrl: './goal-card.html',
  styleUrl: './goal-card.css',
})
export class GoalCard {

  readonly TaskStatus = TaskStatus;
  readonly goal = input.required<Goal>();
  readonly stats = input.required<GoalStats>();
  readonly delete = output();
  
  deleteClick() {
    this.delete.emit();
  }
}
