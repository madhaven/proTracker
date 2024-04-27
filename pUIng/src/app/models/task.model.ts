export class Task {
    id!: number;
    projectId!: number;
    parentId: number | undefined;
    summary!: string;
}
