import { Injectable, computed, inject } from '@angular/core';
import { Goal } from '@models';
import { ApiService } from '@services';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private readonly api = inject(ApiService);
  private readonly goalsResource = this.api.getResource<Goal[]>('/goal');

  readonly goals = computed(() => this.goalsResource.value() ?? []);

  async addGoal(title: string, description: string, targetDate: string) {
    const newGoal = {
      title,
      dateAdded: new Date().toISOString(),
      dateTarget: new Date(targetDate).toISOString(),
    };
    await firstValueFrom(this.api.post<Goal>('/goal', newGoal));
    this.goalsResource.reload();
  }

  async deleteGoal(goalId: string) {
    await firstValueFrom(this.api.delete(`/goal/${goalId}`));
    this.goalsResource.reload();
  }

  getGoalById(goalId: string): Goal | undefined {
    return this.goals().find(g => g.id === goalId);
  }
}
