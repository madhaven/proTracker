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

  static getDayStartTime(timeInMilliseconds: number): number {
    var time = new Date(timeInMilliseconds);
    var dayStart = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    return dayStart.getTime();
  }

  getActivityStart(): number {
    var allHabitLogs = Array
      .from(this.uiStateService.habitLogs.values())
      .map(x => x.dateTime);
    var minTime = Math.min(...allHabitLogs);
    return HabitMetricsService.getDayStartTime(minTime);
  }

  getLogsOfHabit(id: number): number[] {
    var logs = Array
      .from(this.uiStateService.habitLogs.values())
      .filter(log => log.habitId == id)
      .map(log => log.dateTime);
    return logs;
  }

  getHabitFrequencyMap(habit: Habit, labelMap: Map<number, number>): Map<number, number> {
    var freqMap = new Map(labelMap);
    var startTime = HabitMetricsService.getDayStartTime(habit.startTime - this.oneDay);
    freqMap.forEach((val, date) => { freqMap.set(date, date < startTime ? NaN : 0); });

    var logs = this.getLogsOfHabit(habit.id);
    for (var log of logs) {
      var logDate = HabitMetricsService.getDayStartTime(log);
      if (freqMap.has(logDate))
        if (logDate < habit.startTime - this.oneDay)
          freqMap.set(logDate, NaN);
        else
          freqMap.set(logDate, freqMap.get(logDate)! + 1);
    }
    return freqMap;
  }
  
  getHabitStreakMap(habit: Habit, labelmap: Map<number, number>, daysForStreakLoss: number): Map<number, number> {
    var frequencyMap = this.getHabitFrequencyMap(habit, labelmap);
    var streakMap = new Map<number, number>();
    var streakLoss = 0;
    var streak = 0;
    for (var [date, frequency] of frequencyMap) {
      if (Number.isNaN(frequency)) {
        streakMap.set(date, NaN);
        continue;
      } else if (frequency > 0) {
        streakLoss = 0;
        streak += 1;
      } else {
        streakLoss += 1;
        streak = streakLoss >= daysForStreakLoss ? 0 : Math.max(streak-1, 0);
      }
      streakMap.set(date, streak);
    }
    return streakMap;
  }
}
