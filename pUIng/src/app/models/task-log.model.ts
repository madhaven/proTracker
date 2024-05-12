export class TaskLog {
    id!: number;
    taskId!: number;
    statusId!: number;
    dateTime!: number;

    constructor(
        id: number,
        taskId: number,
        statusId: number,
        dateTime: number,
    ) {
        this.id = id;
        this.taskId = taskId;
        this.statusId = statusId;
        this.dateTime = dateTime;
    }
}