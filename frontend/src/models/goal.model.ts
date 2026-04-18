export interface Goal {
  id: string;
  title: string;
  description: string | null;
  dateAdded: string;
  dateTarget: string;
  dateCompleted: string | null;
}
