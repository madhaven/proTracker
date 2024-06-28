export class NewTaskData {
    id?: number;
    dateTime!: number;
    project!: string;
    summary!: string;

    constructor(
        id: number,
        dateTime: number,
        project: string,
        summary: string,
    ) {
        this.id = id;
        this.dateTime = dateTime;
        this.project = project;
        this.summary = summary;
    }
}
