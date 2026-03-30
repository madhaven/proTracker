import { Injectable, computed, inject, signal } from '@angular/core';
import { Goal } from '@models';
import { ApiService } from '@services';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private goalsSignal = signal<Goal[]>([
    { id: 'g1', title: 'Launch Web App MVP', description: 'Complete the first version of the core product and deploy to production.', targetDate: '2026-06-01' },
    { id: 'g2', title: 'Run a Marathon', description: 'Train and successfully complete the city marathon this fall.', targetDate: '2026-10-15' },
  ]);

  goals = computed(() => this.goalsResource.value() ?? []);
  
  private api = inject(ApiService);
  private goalsResource = this.api.getResource<Goal[]>('/goal');

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
