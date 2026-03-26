import { TaskStatus } from "@models";

export interface TaskToggleRequest {
    TaskId: number,
    Status: TaskStatus,
    Time: Date
};