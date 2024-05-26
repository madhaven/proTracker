import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Habit } from '../models/habit.model';
import { Project } from '../models/project.model';
import { TaskLog } from '../models/task-log.model';
import { HabitLog } from '../models/habit-log.model';
import { MenuTabs } from '../common/menu-tabs';
import { TaskStatus } from '../common/task-status';
import { NewTaskData } from '../models/new-task-data.model';
import { Subject } from 'rxjs';
import { Keys } from '../common/keys';

import { DataCommsInterface } from '../common/data-comms-interface';
import { ElectronComService } from './electron-com.service';
import { BrowserBackendService } from '../BrowserBackend/browser-backend.service';
import { LocalStorageService } from './local-storage.service';
import { BrowserDataObject } from '../models/browser-data-object.model';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  // TODO: move to separate object
  // preferences
  foldedProjects = new Map<number, boolean>();
  defaultTab: MenuTabs = MenuTabs.TaskLogs;
  dataProfile: boolean = true;
  idleTolerance: number = 500; // TODO: ng fix

  // data
  appVersion!: string;
  tasks = new Map<number, Task>();
  habits = new Map<number, Habit>();
  projects = new Map<number, Project>();
  logs = new Map<number, TaskLog>();
  habitLogs = new Map<number, HabitLog>();

  // processed data
  logTree = new Map<string, Map<number, Map<number, TaskLog>>>();
  orderredTree: [string, Map<number, Map<number, TaskLog>>][] = [];
  projectTree = new Map<number, Map<number, number>>();

  // deps
  comService!: DataCommsInterface;
  localStorage!: LocalStorageService;

  // subs
  stateChanged = new Subject<UiStateService>();
  stateChanged$ = this.stateChanged.asObservable();
  loadPercent = new Subject<number>();
  loading$ = this.loadPercent.asObservable();

  constructor(
    eComService: ElectronComService,
    browserBackend: BrowserBackendService,
    localStorage: LocalStorageService,
  ) {
    this.localStorage = localStorage;
    if (eComService.comsCheck(false)) {
      this.comService = eComService;
    } else {
      this.comService = browserBackend;
    }
  }

  notifyStateChange() {
    this.stateChanged.next(this);
  }

  getLogTreeAsOrderredList(): [string, Map<number, Map<number, TaskLog>>][] {
    return this.orderredTree;
  }

  getProjectTree() {
    return this.projectTree;
  }

  growTrees() { // TODO optimise
    this.orderredTree = [];
    var pendingLogs = new Map<Task, TaskLog>();
    var orderredLogs = [...this.logs.values()];

    orderredLogs.forEach(log => {
      const dateStr = this._getDateStr(new Date(log.dateTime));
      const task = this.tasks.get(log.taskId);
      const project = this.projects.get(task!.projectId);
      
      if (!this.logTree.has(dateStr))
        this.logTree.set(dateStr, new Map());
      if (!this.logTree.get(dateStr)?.has(project!.id))
        this.logTree.get(dateStr)?.set(project!.id, new Map());
      this.logTree.get(dateStr)?.get(task!.projectId)?.set(task!.id, log)
      this._populateOrderredTree(dateStr, this.logTree.get(dateStr)!);

      if (log.statusId == TaskStatus.PENDING)
        pendingLogs.set(task!, log);
      else
        pendingLogs.delete(task!);

      if (!this.projectTree.has(project!.id))
        this.projectTree.set(project!.id, new Map());
      this.projectTree.get(project!.id)?.set(task!.id, log.statusId);
    })

    // show pending tasks on current date
    const todayStr = this._getDateStr(new Date());
    pendingLogs.forEach((log: TaskLog, task: Task) => {
      if (!this.logTree.has(todayStr))
        this.logTree.set(todayStr, new Map());
      if (!this.logTree.get(todayStr)?.has(task.projectId))
        this.logTree.get(todayStr)?.set(task.projectId, new Map());
      this.logTree.get(todayStr)?.get(task!.projectId)?.set(task!.id, log);

      this._populateOrderredTree(todayStr, this.logTree.get(todayStr)!);
    })
  }

  _getDateStr(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayOfMonth = date.getDate();
    const dateStr = `${year},${month},${dayOfMonth}`;
    return dateStr;
  }

  _populateOrderredTree(dateStr: string, tree: Map<number, Map<number, TaskLog>>): void {
    if (this.orderredTree.length <= 0) {
      this.orderredTree.push([dateStr, tree]);
      return;
    }

    if (this.orderredTree[this.orderredTree.length - 1][0] != dateStr) {
      this.orderredTree.push([dateStr, tree]);
    } else {
      this.orderredTree[this.orderredTree.length - 1][1] = tree;
    }
  }

  logsExist() {
    return this.logs.size > 0;
  }

  toggleFold(projectId: number) {
    var currentFold = this.foldedProjects.get(projectId) ?? false;
    this.foldedProjects.set(projectId, !currentFold);

    var jsonData = JSON.stringify(Array.from(this.foldedProjects.entries()));
    localStorage.setItem(Keys.foldedProjects_2_1_0, jsonData);
    return !currentFold;
  }

  getTask(taskId: number): Task | undefined {
    return this.tasks.get(taskId);
  }

  newTask(newTask: NewTaskData) {
    this.comService.newTask(newTask).then(
      (res: any) => { // TODO: ng standardise data models
        if (res as boolean == false) {
          console.error('invalid data');
          return;
        }
        this.tasks.set(res.task.id, res.task);
        this.projects.set(res.project.id, res.project);
        this.logs.set(res.log.id, res.log);
        this.growTrees();
        this.notifyStateChange();
      },
      (err: any) => {
        console.error('server error while adding new task'); // TODO: notification
      }
    );
  }

  toggleTask(taskId: number, newState: TaskStatus, currentTime: number) {
    this.comService.toggleTask(taskId, newState, currentTime).then(
      (res: TaskLog|boolean) => {
        if (res as boolean == false) {
          console.error('invalid data');
          return;
        }
        res = res as TaskLog;
        this.logs.set(res.id, res);

        // update trees
        const tree = this.logTree.get(this._getDateStr(new Date()));
        const task = this.tasks.get(taskId)!;
        const project = this.projects.get(task.projectId)!;
        tree?.get(project.id)!.set(task.id, res);
        this.orderredTree[this.orderredTree.length-1][1].get(project.id)!.set(task.id, res)

        this.notifyStateChange();
      },
      (err: any) => {
        console.error('server error while updating task'); // TODO remove error logs
      }
    );
  }

  editTask(newTask: Task) {
    this.comService.editTask(newTask!).then(
      (res: boolean) => { // TODO: document responses
        if (res as boolean == false) {
          console.error('Something went wrong while editing task'); // TODO: notification
          return;
        } else {
          this.tasks.set(newTask.id, newTask);
          this.notifyStateChange();
        }
      },
      (err: any) => {
        console.error('Unable to edit Task due to an internal error'); // TODO: notification
      }
    );
  }

  getProject(projectId: number): Project | undefined {
    return this.projects.get(projectId);
  }

  editProject(newProject: Project) {
    this.comService.editProject(newProject!).then(
      (res: Project|boolean) => {
        if (res as boolean == false) {
          // TODO: create structured responses, false values limits the reasons for failure
          // console.warn('Yo wtf, that name already exists!')
          console.error(`Something went wrong while editing project`); // TODO: CREATE APP NOTIFICATION
          return;
        } else {
          this.projects.set(newProject!.id, newProject!);
          this.notifyStateChange();
        }
      },
      (err: any) => {
        console.error('Unable to edit Project due to an internal error');
      }
    );
  }

  getHabit(habitId: number): Habit | undefined {
    return this.habits.get(habitId);
  }

  newHabit(
    title: string,
    frequency: number,
    startTime: number = Date.now(),
    endTime: number = Infinity
  ) {
    // title, Date.now(), Infinity, frequency
    var newHabit: Habit = {
      id: -1,
      name: title,
      days: frequency,
      startTime: startTime,
      endTime: endTime
    } as Habit;

    this.comService.newHabit(newHabit).then(
      (res: Habit|boolean) => {
        if (res as boolean == false) {
          console.error('Habit create invalid');
          return;
        } else {
          res = res as Habit;
          this.habits.set(res.id, res);
          this.notifyStateChange();
        }
      },
      (err: any) => {
        console.error('server errored while adding habit', err); // TODO: notification
      }
    );
  }

  editHabit(newHabit: Habit) {
    this.comService.editHabit(newHabit).then(
      (res: Habit|boolean) => {
        if (res as boolean == false) {
          console.error('Habit edit invalid');
          return;
        } else {
          res = res as Habit;
          this.habits.set(res.id, res);
          this.notifyStateChange();
        }
      },
      (err: any) => {
        console.error('server errored while editing habit', err); // TODO: notification
      }
    );
  }

  markHabitDone(habit: Habit) {
    this.comService.habitDone(habit.id, Date.now()).then(
      (res: HabitLog|boolean) => {
        if (res as boolean == false) {
          console.error('Unable to mark Habit as done due to some error');
          return;
        } else {
          res = res as HabitLog;
          this.habitLogs.set(res.id, res);
          this.habits.get(res.habitId)!.lastLogTime = res.dateTime;
          this.notifyStateChange();
        }
      },
      (err: any) => {
        console.error('server error while updating habit', err); // TODO: notification
      }
    );
  }

  getHabitsDueOn(today: Date): Map<number, Habit> {
    var dueHabits = new Map<number, Habit>();
    for (let [id, habit] of this.habits) {
      var lastLog = new Date(habit.lastLogTime);
      if (lastLog.getFullYear() != today.getFullYear()
      || lastLog.getMonth() != today.getMonth()
      || lastLog.getDate() != today.getDate()) {
        dueHabits.set(id, habit);
      } else {
        dueHabits.delete(id);
      }
    }
    return dueHabits;
  }

  loadData() {
    this.loadPercent.next(10);
    this.comService.loadData()
    .then((res: BrowserDataObject|false) => {
      if (res == false) {
        this.replaceData();
        this.loadPercent.next(100);
        return;
        // TODO: notification ?
      } else {
        // fetch data
        console.log('data received from db');
        this.loadPercent.next(33);
        this.replaceData(res.tasks, res.taskLogs, res.projects, res.habits, res.habitLogs, res.appVersion);
        this.loadPercent.next(66);
        
        // fetch UI info
        try {
          const data: [number, boolean][] = JSON.parse(this.localStorage.getItem(Keys.foldedProjects_2_1_0) ?? '[]')
          const projectFoldData = new Map(data);
          this.foldedProjects = projectFoldData;
          this.loadPercent.next(82);
        } catch(err) {
          // handles data inconsistencies across UI versions
          console.log('folded Projects were unreadable, reverting to default.')
          this.localStorage.removeItem(Keys.foldedProjects_2_1_0);
          this.foldedProjects = new Map();
          this.loadPercent.next(95);
        } finally {
          this.loadPercent.next(100);
        }
      }
    })
    .catch((err: any) => {
      console.error('server error while loading data'); // TODO: notification
      this.replaceData();
      this.loadPercent.next(100);
    });
  }

  replaceData(
    tasks: Task[] = [],
    taskLogs: TaskLog[] = [],
    projects: Project[] = [],
    habits: Habit[] = [],
    habitLogs: HabitLog[] = [],
    appVersion: string = ''
  ) {
    this.appVersion = appVersion;
    this.logs = new Map();
    this.tasks = new Map();
    this.habits = new Map();
    this.projects = new Map();
    this.habitLogs = new Map();
    
    for (var log of taskLogs) { this.logs.set(log.id, log); }
    for (var task of tasks) { this.tasks.set(task.id, task); }
    for (var habit of habits) { this.habits.set(habit.id, habit); }
    for (var project of projects) { this.projects.set(project.id, project); }
    for (var habitLog of habitLogs) { this.habitLogs.set(habitLog.id, habitLog); }

    this.growTrees();
    this.notifyStateChange();
  }

  exportData() {
    return this.comService.exportData(this.logTree);
  }
}
