import { Injectable } from '@angular/core';
import { TaskStatus } from '../common/task-status';
import { HabitLog } from '../models/habit-log.model';
import { Habit } from '../models/habit.model';
import { NewTask } from '../models/new-task.model';
import { Project } from '../models/project.model';
import { TaskLog } from '../models/task-log.model';
import { Task } from '../models/task.model';
import { LocalStorageService } from './local-storage.service';
import { DataCommsInterface } from '../common/data-comms-interface';

@Injectable({
  providedIn: 'root'
})
export class BrowserBackendService implements DataCommsInterface {

  // data
  tasks: [Task][] = [];
  taskLogs: [TaskLog][] = [];
  projects: [Project][] = [];
  habits: [Habit][] = [];
  habitLogs: [HabitLog][] = [];
  lastId_tasks: number = -1;
  lastId_taskLogs: number = -1;
  lastId_projects: number = -1;
  lastId_habits: number = -1;
  lastId_habitLogs: number = -1;
  appVersion: string = 'Lite';

  LS: LocalStorageService;

  constructor(localStorage: LocalStorageService) {
    this.LS = localStorage;
  }

  newTask(newTask: NewTask) {
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
  loadData(): Promise<Object> {
    return new Promise((res, rej) => {
      var stringData = this.LS.getItem('_data_')
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
    })
    this.LS.setItem('_data_', data);
  }

  exportData(logTree: Map<string, Map<number, Map<number, TaskLog>>>) {
    throw new Error('Method not implemented.');
  }

  findLastIndex(map: Map<number, any>) {
    var highestIndexFound = -1
    map.forEach((value: any, key: number) => {
      if (key > highestIndexFound)
        highestIndexFound = key
    })
    return highestIndexFound;
  }
}
