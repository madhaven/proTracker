import { Injectable } from '@angular/core';
import { HabitLog } from '../models/habit-log.model';
import { Habit } from '../models/habit.model';
import { UiStateService } from './ui-state.service';

@Injectable({
  providedIn: 'root'
})
export class HabitMetricsService {

  uiStateService: UiStateService;

  constructor(
    uiStateService: UiStateService,
  ) {
    this.uiStateService = uiStateService;
  }

  getLogsOfHabit(id: number): HabitLog[] {
    var logs = Array
      .from(this.uiStateService.habitLogs.values())
      .filter(log => log.habitId == id);
    return logs;
  }

  generateDailyFrequency(habit: Habit): Map<Date, number> {
    var logs = this.getLogsOfHabit(habit.id).map(log => log.dateTime);
    var dailyFrequency = new Map<Date, number>();
    var now = Date.now();
    var timeOfDay = habit.startTime ?? logs[0] ?? 0;
    var index = 0;
    var oneDay = 24 * 60 * 60 * 1000;
    
    // travel through time and logs to set up data
    while ( timeOfDay <= now && timeOfDay < (habit.endTime??Infinity) && index < logs.length ) {
      var date = new Date(timeOfDay);
      
      if (logs[index] < timeOfDay) {
        index++;
      } else if (logs[index] <= timeOfDay + oneDay) {
        var existingFrequency = dailyFrequency.get(date) ?? 0;
        dailyFrequency.set(date, existingFrequency + 1);
        index++;
      } else {
        if (!dailyFrequency.has(date)) {
          dailyFrequency.set(date, 0);
        }
        timeOfDay += oneDay;
      }
    }

    return dailyFrequency
  }
}
