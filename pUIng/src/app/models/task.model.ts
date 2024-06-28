export class Task {
    id!: number;
    projectId!: number;
    parentId: number | undefined;
    summary!: string;

    constructor(
        id: number,
        projectId: number,
        parentId: number | undefined,
        summary: string,
    ) {
        this.id = id;
        this.projectId = projectId;
        this.parentId = parentId;
        this.summary = summary;
    }
}
