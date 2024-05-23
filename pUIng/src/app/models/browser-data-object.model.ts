import { HabitLog } from "./habit-log.model";
import { Habit } from "./habit.model";
import { Project } from "./project.model";
import { TaskLog } from "./task-log.model";
import { Task } from "./task.model";

export class BrowserDataObject {
    tasks!: Task[];
    taskLogs!: TaskLog[];
    projects!: Project[];
    habits!: Habit[];
    habitLogs!: HabitLog[];
    appVersion!: string;

    constructor(
        tasks: Task[],
        taskLogs: TaskLog[],
        projects: Project[],
        habits: Habit[],
        habitLogs: HabitLog[],
        appVersion: string,
    ) {
        this.tasks = tasks;
        this.taskLogs = taskLogs;
        this.projects = projects;
        this.habits = habits;
        this.habitLogs = habitLogs;
        this.appVersion = appVersion;
    }
}
