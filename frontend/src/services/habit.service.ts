import { Injectable, signal } from '@angular/core';
import { Habit } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private habitsSignal = signal<Habit[]>([
    { id: 'h1', title: 'Morning Jog (5km)', frequency: 'daily', streak: 14 },
    { id: 'h2', title: 'Read 20 Pages', frequency: 'daily', streak: 5 },
    { id: 'h3', title: 'Water Plants', frequency: 'weekly', streak: 3 },
  ]);

  habits = this.habitsSignal.asReadonly();

  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  addHabit(title: string, frequency: 'daily' | 'weekly') {
    const newHabit: Habit = {
      id: this.uid(),
      title,
      frequency,
      streak: 0
    };
    this.habitsSignal.update(hs => [newHabit, ...hs]);
  }

  deleteHabit(habitId: string) {
    this.habitsSignal.update(hs => hs.filter(h => h.id !== habitId));
  }

  updateStreak(habitId: string, delta: number) {
    this.habitsSignal.update(hs => hs.map(h => {
        if(h.id === habitId) {
            return { ...h, streak: h.streak + delta };
        }
        return h;
    }));
  }
}
