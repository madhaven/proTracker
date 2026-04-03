import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { TaskService } from '@services';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'pt-main-content',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  ngOnInit(): void {
    this.taskService.generateHabitTasks();
  }
}