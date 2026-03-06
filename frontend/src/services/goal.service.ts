import { Injectable, signal } from '@angular/core';
import { Goal } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private goalsSignal = signal<Goal[]>([
    { id: 'g1', title: 'Launch Web App MVP', description: 'Complete the first version of the core product and deploy to production.', targetDate: '2026-06-01', color: 'indigo' },
    { id: 'g2', title: 'Run a Marathon', description: 'Train and successfully complete the city marathon this fall.', targetDate: '2026-10-15', color: 'emerald' },
  ]);

  goals = this.goalsSignal.asReadonly();

  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  addGoal(title: string, description: string, targetDate: string) {
    const newGoal: Goal = {
      id: this.uid(),
      title,
      description,
      targetDate,
      color: 'indigo'
    };
    this.goalsSignal.update(gs => [newGoal, ...gs]);
  }

  deleteGoal(goalId: string) {
    this.goalsSignal.update(gs => gs.filter(g => g.id !== goalId));
  }

  getGoalById(goalId: string): Goal | undefined {
    return this.goalsSignal().find(g => g.id === goalId);
  }
}
