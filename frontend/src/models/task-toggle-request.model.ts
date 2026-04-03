import { TaskStatus } from "@models";

export interface TaskToggleRequest {
    TaskId: string,
    Status: TaskStatus,
    Time: Date
};