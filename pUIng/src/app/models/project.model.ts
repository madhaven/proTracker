import { Task } from "./task.model"

export class Project {
    id!: number;
    name!: string;
    tasks!: Array<Task>;

    constructor(
        id: number,
        name: string,
        tasks: Array<Task>,
    ) {
        this.id = id;
        this.name = name;
        this.tasks = tasks;
    }
}
