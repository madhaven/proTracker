export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  goalId?: string | null;
  habitId?: string | null;
}
