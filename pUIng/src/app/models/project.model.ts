import { Task } from "./task.model"

export class Project {
    id!: number
    name!: string
    tasks!: Array<Task>
}
