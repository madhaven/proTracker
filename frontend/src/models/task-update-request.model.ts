import { TaskStatus } from "@models";

export interface TaskUpdateRequest {
    id: number;
    goalId: number | null;
    title: string;
    status: TaskStatus;
    completeBy: Date | string | null;
    completedOn: Date | string | null;
}