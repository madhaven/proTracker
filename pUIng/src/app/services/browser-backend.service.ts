import { afterNextRender, Injectable } from '@angular/core';
import { TaskStatus } from '../common/task-status';
import { HabitLog } from '../models/habit-log.model';
import { Habit } from '../models/habit.model';
import { NewTask } from '../models/new-task.model';
import { Project } from '../models/project.model';
import { TaskLog } from '../models/task-log.model';
import { Task } from '../models/task.model';
import { LocalStorageService } from './local-storage.service';
import { DataCommsInterface } from '../common/data-comms-interface';
import { Keys } from '../common/keys';
import { LocalStoreObject } from '../models/local-store-object.model';

@Injectable({
  providedIn: 'root'
})
export class BrowserBackendService implements DataCommsInterface {

  // data
  tasks: Map<number, Task> = new Map();
  taskLogs: Map<number, TaskLog> = new Map();
  projects: Map<number, Project> = new Map();
  habits: Map<number, Habit> = new Map();
  habitLogs: Map<number, HabitLog> = new Map();
  lastId_tasks: number = -1;
  lastId_taskLogs: number = -1;
  lastId_projects: number = -1;
  lastId_habits: number = -1;
  lastId_habitLogs: number = -1;
  appVersion: string = 'Lite';

  private LS!: LocalStorageService;

  constructor(LS: LocalStorageService) {
    this.LS = LS;
    afterNextRender(() => {
      this.loadFromLocalStorage();
    });
  }

  initializeLocalStorage(): LocalStoreObject {
    var data = new LocalStoreObject([], [], [], [], [], 'LITE');
    this.LS.setItem(Keys.browserDataStorage_0_0_0, data);
    return data;
  }

  dumpToLocalStorage() {
    var data = new LocalStoreObject(
      Array.from(this.tasks.values()),
      Array.from(this.taskLogs.values()),
      Array.from(this.projects.values()),
      Array.from(this.habits.values()),
      Array.from(this.habitLogs.values()),
      this.appVersion,
    );
    this.LS.setItem(Keys.browserDataStorage_0_0_0, data);
    console.log('Data dumped');
  }

  loadFromLocalStorage() {
    var data:LocalStoreObject = this.LS.getItem(Keys.browserDataStorage_0_0_0);
    if (!data) {
      data = this.initializeLocalStorage();
      console.log('Fetched data after init from localStore', data);
    } else {
      console.log('Fetched data from localStore', data);
    }
  }

  createProject(name: string): Project {
    var newProject = new Project();
    newProject.id = ++this.lastId_projects;
    newProject.name = name;
    this.projects.set(newProject.id, newProject);
    return newProject;
  }
  getProjectByName(name: string): Project|false {
    const res = [...this.projects.values()].filter((project) => project.name == name);
    return res.length > 0 ? res[0] : false;
  }
  getProjectByNameOrCreate(name: string): Project {
    const existingProject = this.getProjectByName(name);
    if (existingProject) {
      return existingProject;
    } else {
      const newProject = this.createProject(name);
      return newProject;
    }
  }
  update(project: Project): boolean {
    if (!this.projects.has(project.id)) return false;
    this.projects.set(project.id, project);
    return true;
  }
  // delete(project: Project): boolean {} // TODO
  createTask(taskName: string, projectId: number, parentId: number) {
    var newTask = new Task();
    newTask.id = ++this.lastId_tasks;
    newTask.summary = taskName;
    newTask.projectId = projectId;
    newTask.parentId = parentId;
    this.tasks.set(newTask.id, newTask);
    this.dumpToLocalStorage();
    return newTask;
  }
  getAllTasksOfProject(projectId: number): Task[]|false {
    const res = [...this.tasks.values()].filter((task) => task.projectId == projectId);
    return res.length > 0 ? res : false;
  }
  updateTask(task: Task): boolean {
    if (!this.tasks.has(task.id)) return false;
    this.tasks.set(task.id, task);
    return true;
  }
  // deleteTask(task): boolean {} TODO
  createHabit(newHabit: Habit) {
    newHabit.id = ++this.lastId_habits;
    this.habits.set(newHabit.id, newHabit);
    return newHabit;
  }
  updateHabit(habit: Habit): boolean {
    if (!this.habits.has(habit.id)) return false;
    this.habits.set(habit.id, habit);
    return true;
  }
  // deleteHabit(habit: Habit): boolena {} // TODO
  createTaskLog(newTaskLog: TaskLog): TaskLog {
    newTaskLog.id = ++this.lastId_taskLogs;
    this.taskLogs.set(newTaskLog.id, newTaskLog);
    return newTaskLog;
  }
  createHabitLog(newHabitLog: HabitLog): HabitLog {
    newHabitLog.id = ++this.lastId_habitLogs;
    this.habitLogs.set(newHabitLog.id, newHabitLog);
    return newHabitLog;
  }
  getStatusById(id: number) {
    // TODO: move to LocalStorage: add DB versioning
    switch (id) {
      case 1: return {id: 1, status: "pending"};
      case 2: return {id: 2, status: "in_progress"};
      case 3: return {id: 3, status: "need_info"};
      case 4: return {id: 4, status: "completed"};
      case 5: return {id: 5, status: "waiting"};
      case 6: return {id: 6, status: "wont_do"};
      default: return false;
    }
  }

  newTask(newTask: NewTask) { // TODO: remove unwanted abstraction of Task
    newTask.dateTime = new Date(newTask.dateTime).getTime();
    newTask.project = newTask.project.trim();
    newTask.summary = newTask.summary.trim();
    
    const project = this.getProjectByNameOrCreate(newTask.project)
    const task = this.createTask(newTask.summary, project.id, -1);
    const status = this.getStatusById(1);

    var newTaskLog = new TaskLog();
    newTaskLog.dateTime = newTask.dateTime;
    newTaskLog.id = -1;
    newTaskLog.statusId = 1;
    newTaskLog.taskId = task.id;
    const taskLog = this.createTaskLog(newTaskLog);

    return (project && task && taskLog)
      ? new Promise((res, rej) => res({
          "task": task,
          "log": taskLog,
          "project": project,
        }))
      : new Promise((res, rej) => res(false));
  }
  editTask(newTask: Task) {
    throw new Error('Method not implemented.');
  }
  toggleTask(id: number, newState: TaskStatus, currentTime: number) {
    throw new Error('Method not implemented.');
  }
  newHabit(newHabit: Habit) {
    throw new Error('Method not implemented.');
  }
  editHabit(newHabit: Habit) {
    throw new Error('Method not implemented.');
  }
  habitDone(id: number, time: number) {
    throw new Error('Method not implemented.');
  }
  deleteHabit(id: number) {
    throw new Error('Method not implemented.');
  }
  editProject(newProject: Project) {
    throw new Error('Method not implemented.');
  }
  loadData(): Promise<LocalStoreObject|false> {
    return new Promise((res, rej) => {
      var stringData = this.LS.getItem(Keys.browserDataStorage_0_0_0);
      if (stringData == null) {
        res(false);
      } else {
        const jsonData = JSON.parse(stringData);
        res(jsonData);
      }
    });
  }
  saveData() {
    var data = JSON.stringify({
      tasks: this.tasks,
      taskLogs: this.taskLogs,
      projects: this.projects,
      habits: this.habits,
      habitLogs: this.habitLogs,
      appVersion: this.appVersion,
    });
    this.LS.setItem(Keys.browserDataStorage_0_0_0, data);
  }

  exportData(logTree: Map<string, Map<number, Map<number, TaskLog>>>) {
    throw new Error('Method not implemented.');
  }

  findLastIndex(map: Map<number, any>) {
    var highestIndexFound = -1;
    map.forEach((value: any, key: number) => {
      if (key > highestIndexFound)
        highestIndexFound = key;
    })
    return highestIndexFound;
  }
}
