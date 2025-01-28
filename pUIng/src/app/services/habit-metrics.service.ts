import { Injectable } from '@angular/core';
import { HabitLog } from '../models/habit-log.model';
import { Habit } from '../models/habit.model';
import { UiStateService } from './ui-state.service';

@Injectable({
  providedIn: 'root'
})
export class HabitMetricsService {

  uiStateService: UiStateService;
  oneDay: number = 24 * 60 * 60 * 1000;

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService;
  }

  getActivityStart(): number {
    var allHabitLogs = Array
      .from(this.uiStateService.habitLogs.values())
      .map(x => x.dateTime);
    return Math.min(...allHabitLogs);
  }

  getLogsOfHabit(id: number): number[] {
    var logs = Array
      .from(this.uiStateService.habitLogs.values())
      .filter(log => log.habitId == id)
      .map(log => log.dateTime);
    return logs;
  }

  getHabitFrequencyMap(habit: Habit, startTime: number): Map<Date, number> {
    var logs = this.getLogsOfHabit(habit.id);
    var data = new Map<Date, number>();
    var timeNow = Date.now();
    var index = 0;

    while (startTime <= (timeNow + this.oneDay) && index < logs.length) {
      var date = new Date(startTime);
      if (logs[index] <= startTime) {
        index++;
        data.set(date, NaN);
      } else if (logs[index] <= startTime + this.oneDay) {
        data.set(date, (data.get(date) ?? 0) + 1);
        index++;
      } else {
        if (!data.has(date)) data.set(date, 0);
        startTime += this.oneDay;
      }
    }
    return data;
  }

  getHabitStreakMap(habit: Habit, startTime: number, daysForStreakLoss: number): Map<Date, number> {
    var frequencyMap = this.getHabitFrequencyMap(habit, startTime);
    var streakMap = new Map<Date, number>();
    var streakLoss = 0;
    var streak = 0;
    for (var [date, frequency] of frequencyMap) {
      if (frequency > 0) {
        streak += 1;
        streakLoss = 0;
      } else {
        streak = Math.max(streak-1, 0);
        streakLoss += 1;
        if (streakLoss >= daysForStreakLoss)
          streak = 0;
      }
      streakMap.set(date, streak);
    }
    return streakMap;
  }
}
