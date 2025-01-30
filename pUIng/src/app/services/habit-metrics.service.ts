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
    var minTime = new Date(Math.min(...allHabitLogs));
    var activityStartDate = new Date(minTime.getFullYear(), minTime.getMonth(), minTime.getDate());
    return activityStartDate.getTime();
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
    var x = new Date(startTime);
    
    var timePoint = new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    var index = 0;
    console.log('frequncymaplength', logs.length);
    while (timePoint <= timeNow && index < logs.length) {
      var date = new Date(timePoint);
      if (logs[index] > timePoint + this.oneDay) {
        if (!data.has(date)) data.set(date, 0);
        timePoint += this.oneDay;  
      } else if (logs[index] <= timePoint + this.oneDay) {
        data.set(date, (data.get(date) ?? 0) + 1);
        index++;
      } else if (logs[index] < timePoint) {
        data.set(date, NaN);
        index++;
      }
    }
    console.log('frequencyMap', data);
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
    console.log('streakMap', streakMap);
    return streakMap;
  }
}
