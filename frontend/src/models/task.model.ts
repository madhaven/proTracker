import { TaskStatus } from "@models";

export interface Task {
  id: string;
  title: string;
  taskStatus: TaskStatus;
  priority: number;
  createdOn: Date;
  completeBy?: Date;
  completedOn?: Date;
  goalId?: string | null;
  // habitId?: string | null;
}
