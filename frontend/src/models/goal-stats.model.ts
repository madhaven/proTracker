import { Task } from "@models";

export interface GoalStats {
    total: number,
    completed: number,
    percentage: number,
    allTasks: Task[],
}