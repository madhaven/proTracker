import { Injectable, computed, inject } from '@angular/core';
import { Habit } from '@models';
import { ApiService } from '@services';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private readonly api = inject(ApiService);
  private readonly habitsResource = this.api.getResource<Habit[]>('/habit');

  readonly habits = computed(() => {
    const rawHabits = this.habitsResource.value() ?? [];
    return rawHabits.map((h: any) => ({ ...h, id: String(h.id) })) as Habit[];
  });

  async addHabit(title: string, frequency: 'daily' | 'weekly') {
    const newHabit: Omit<Habit, 'id'> = {
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
