import { Task } from "../models/task.model";
import { Project } from "../models/project.model";
import { NewTask } from "../models/new-task.model";
import { Injectable } from "@angular/core";
import { TaskStatus } from "../common/task-status";
import { DataComService } from "./data-com.service";
import { Habit } from "../models/habit.model";
import { TaskLog } from "../models/task-log.model";

declare global {
  interface Window {
    comms: any;
  }
}

@Injectable({ providedIn: 'root' })
export class ElectronComService extends DataComService {

  comsCheck() {
    if (!window.comms) {
      console.error("DataComs Down");
      return false;
    }
    return true;
  }

  override getAppVersion() {
    if (!this.comsCheck()) return;
    return window.comms.getAppVersion()
  }

  override loadData() {
    if (!this.comsCheck()) return;
    return window.comms.loadData();
  }

  override exportData(logTree: Map<string, Map<number, Map<number, TaskLog>>>) {
    if (!this.comsCheck()) return;
    return window.comms.exportData(logTree);
  }

  override newTask(task: NewTask) {
    if (!this.comsCheck()) return;
    return window.comms.newTask(task);
  }

  override toggleTask(id: number, newState: TaskStatus, currentTime: number) {
    if (!this.comsCheck()) return;
    return window.comms.toggleTask(id, newState, currentTime);
  }

  override editTask(newTask: Task) {
    if (!this.comsCheck()) return;
    return window.comms.editTask(newTask);
  }

  override editProject(newProject: Project) {
    if (!this.comsCheck()) return;
    return window.comms.editProject(newProject);
  }

  override newHabit(habit: Habit) {
    if (!this.comsCheck()) return;
    return window.comms.newHabit(habit);
  }

  override editHabit(newHabit: Habit) {
    if (!this.comsCheck()) return;
    return window.comms.editHabit(newHabit);
  }

  override habitDone(id: number, time: number) {
    if (!this.comsCheck()) return;
    return window.comms.habitDone(id, time);
  }
}