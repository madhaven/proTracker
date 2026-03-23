import { Injectable, computed, inject, signal } from '@angular/core';
import { Habit } from '@models';
import { ApiService } from '@services';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private api = inject(ApiService);
  private habitsSignal = signal<Habit[]>([
    { id: 'h1', title: 'Morning Jog (5km)', frequency: 'daily', streak: 14 },
    { id: 'h2', title: 'Read 20 Pages', frequency: 'daily', streak: 5 },
    { id: 'h3', title: 'Water Plants', frequency: 'weekly', streak: 3 },
  ]);

  private habitsResource = this.api.getResource<Habit[]>('/habit');

  habits = computed(() => this.habitsResource.value() ?? []);

  async addHabit(title: string, frequency: 'daily' | 'weekly') {
    const newHabit: Partial<Habit> = {
      title,
      frequency,
      streak: 0
    };
    await firstValueFrom(this.api.post<Habit>('/habit', newHabit));
    this.habitsResource.reload();
  }

  async deleteHabit(habitId: string) {
    await firstValueFrom(this.api.delete(`/habit/${habitId}`));
    this.habitsResource.reload();
  }

  async updateStreak(habitId: string, delta: number) {
    const habit = this.habits().find(h => h.id === habitId);
    if (!habit) return;
    await firstValueFrom(this.api.put(`/habit/${habitId}`, { ...habit, streak: habit.streak + delta }));
    this.habitsResource.reload();
  }
}
