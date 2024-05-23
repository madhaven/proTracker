import { afterNextRender, Injectable } from '@angular/core';
import { TaskStatus } from '../common/task-status';
import { HabitLog } from '../models/habit-log.model';
import { Habit } from '../models/habit.model';
import { NewTaskData } from '../models/new-task-data.model';
import { Project } from '../models/project.model';
import { TaskLog } from '../models/task-log.model';
import { Task } from '../models/task.model';
import { LocalStorageService } from '../services/local-storage.service';
import { DataCommsInterface } from '../common/data-comms-interface';
import { Keys } from '../common/keys';
import { BrowserDataObject } from '../models/browser-data-object.model';
import { LocalStorageVersionService } from '../BrowserBackend/local-storage-version.service';

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
  private LSVersionService!: LocalStorageVersionService;

  constructor(
    ls: LocalStorageService,
    lsvs: LocalStorageVersionService,
  ) {
    this.LS = ls;
    this.LSVersionService = lsvs;
  }

  dumpToLocalStorage() {
    var data = new BrowserDataObject(
      Array.from(this.tasks.values()),
      Array.from(this.taskLogs.values()),
      Array.from(this.projects.values()),
      Array.from(this.habits.values()),
      Array.from(this.habitLogs.values()),
      this.appVersion,
    );
    var exportableData = this.LSVersionService
      .getLatestVersion()
      .getExportableData(data);
    this.LS.setItem(Keys.browserDataStorage_0_0_0, exportableData);
  }
  
  loadData(): Promise<BrowserDataObject|false> {
    return new Promise((res, rej) => {
      try {
        // fetch data from LS
        var jsonData:any = this.LS.getItem(Keys.browserDataStorage_0_0_0);

        // read data
        if (!jsonData) {
          var version = this.LSVersionService.getLatestVersion();
          var data = version.setup();
          res(data);
          return;
        } else {
          var data = this.LSVersionService
            .getVersionFromString(jsonData!.lsVersion)
            .read(jsonData);
          this.replaceData(data);
          res(data);
          return;
        }
      } catch (err) {
        rej("Browser Data failed to load"); // TODO: Notification
      }
    });
  }

  replaceData(data: BrowserDataObject) {
    data.tasks.forEach(task => { this.tasks.set(task.id, task); });
    data.taskLogs.forEach(taskLog => { this.taskLogs.set(taskLog.id, taskLog); });
    data.projects.forEach(project => { this.projects.set(project.id, project); });
    data.habits.forEach(habit => { this.habits.set(habit.id, habit); });
    data.habitLogs.forEach(habitLog => { this.habitLogs.set(habitLog.id, habitLog); });
    this.lastId_tasks = this.findLastIndex(this.tasks);
    this.lastId_taskLogs = this.findLastIndex(this.taskLogs);
    this.lastId_projects = this.findLastIndex(this.projects);
    this.lastId_habits = this.findLastIndex(this.habits);
    this.lastId_habitLogs = this.findLastIndex(this.habitLogs);
  }

  findLastIndex(map: Map<number, any>) {
    var highestIndexFound = -1;
    map.forEach((value: any, key: number) => {
      if (key > highestIndexFound)
        highestIndexFound = key;
    })
    return highestIndexFound;
  }

  //#region backend Logic

  createProject(name: string): Project {
    const newProject = new Project(++this.lastId_projects, name, []);
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
  updateProject(project: Project): boolean {
    if (!this.projects.has(project.id)) return false;
    this.projects.set(project.id, project);
    return true;
  }
  // delete(project: Project): boolean {}
  createTask(taskName: string, projectId: number, parentId: number) {
    const newTask = new Task(++this.lastId_tasks, projectId, parentId, taskName);
    this.tasks.set(newTask.id, newTask);
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
  // deleteTask(task): boolean {}
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
  // deleteHabit(habit: Habit): boolena {}
  createTaskLog(newTaskLog: TaskLog): TaskLog {
    newTaskLog.id = ++this.lastId_taskLogs;
    this.taskLogs.set(newTaskLog.id, newTaskLog);
    return newTaskLog;
  }
  createHabitLog(newHabitLog: HabitLog): HabitLog {
    newHabitLog.id = ++this.lastId_habitLogs;
    this.habitLogs.set(newHabitLog.id, newHabitLog);

    // update Habit with latest date
    const habit = this.habits.get(newHabitLog.habitId);
    habit!.lastLogTime = newHabitLog.dateTime;
    this.habits.set(habit!.id, habit!);

    return newHabitLog;
  }

  //#endregion

  newTask(newTask: NewTaskData) {
    return new Promise((res, rej) => {
      newTask.dateTime = new Date(newTask.dateTime).getTime();
      newTask.project = newTask.project.trim();
      newTask.summary = newTask.summary.trim();
      
      const project = this.getProjectByNameOrCreate(newTask.project);
      const task = this.createTask(newTask.summary, project.id, -1);
      const newTaskLog = new TaskLog(-1, task.id, TaskStatus.PENDING, newTask.dateTime);
      const taskLog = this.createTaskLog(newTaskLog);

      this.dumpToLocalStorage();
      res((project && task && taskLog)
        ? {
            "task": task,
            "log": taskLog,
            "project": project,
          }
        : false
      );
    });
  }
  
  editTask(newTask: Task) {
    return new Promise((res, rej) => {
      const result = this.updateTask(newTask);
      this.dumpToLocalStorage();
      res(result);
    });
  }

  toggleTask(id: number, newState: TaskStatus, currentTime: number) {
    return new Promise((res, rej) => {
      const taskLog = new TaskLog(-1, id, newState, new Date(currentTime).getTime());
      const result = this.createTaskLog(taskLog);
      this.dumpToLocalStorage();
      res(result);
    });
  }

  newHabit(newHabit: Habit) {
    return new Promise((res, rej) => {
      if (newHabit.days > 7
        || newHabit.days < 1
        || newHabit.name.length <= 0
      ) res(false);
      newHabit.endTime = new Date(newHabit.endTime!).getTime();
      newHabit.lastLogTime = new Date(newHabit.lastLogTime!).getTime();
      newHabit.startTime = new Date(newHabit.startTime!).getTime();

      const habit = this.createHabit(newHabit);
      this.dumpToLocalStorage();
      res(habit);
    });
  }

  editHabit(newHabit: Habit) { // TODO standardize API to return boolean on updates;
    return new Promise((res, rej) => {
      const result = this.updateHabit(newHabit);
      this.dumpToLocalStorage();
      res(result ? newHabit : false);
    });
  }

  habitDone(id: number, time: number) {
    return new Promise((res, rej) => {
      const habit = this.habits.get(id);
      const lastDayLogged = new Date(habit!.lastLogTime);
      const today = new Date();

      if (today.getFullYear() == lastDayLogged.getFullYear()
        && today.getMonth() == lastDayLogged.getMonth()
        && today.getDate() == lastDayLogged.getDate()
      ) {
        throw Error("Already Logged Habit for the day"); // TODO: Notification
      } else {
        const newHabitLog = new HabitLog(-1, id, time);
        const habitLog = this.createHabitLog(newHabitLog);
        console.log('habitDone', habitLog);
        this.dumpToLocalStorage();
        return habitLog ?? false;
      }
    });
  }

  deleteHabit(id: number) {
    throw new Error('Method not implemented.');
  }

  editProject(newProject: Project) {
    return new Promise((res, rej) => {
      const projectInStore = this.getProjectByName(newProject.name);
      if (projectInStore) {
        res(false);
      }

      const result = this.updateProject(newProject);
      this.dumpToLocalStorage();
      res(result);
    });
  }

  exportData(logTree: Map<string, Map<number, Map<number, TaskLog>>>) {
    throw new Error('Method not implemented.');
  }
}
