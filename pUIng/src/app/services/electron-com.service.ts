import { Task } from "../models/task.model";
import { Project } from "../models/project.model";
import { NewTask } from "../models/new-task.model";
import { Injectable } from "@angular/core";
import { TaskStatus } from "../common/task-status";
import { Habit } from "../models/habit.model";
import { TaskLog } from "../models/task-log.model";
import { DataCommsInterface } from "../common/data-comms-interface";

declare global {
  interface Window {
    comms: any;
  }
}

@Injectable({ providedIn: 'root' })
export class ElectronComService implements DataCommsInterface {

  comsCheck() {
    var result = false;
    try {
      if (!window.comms) {} else { result = true; }
    } finally {
      console.log(result ? "Electron found" : "Electron not found");
      return result;
    }
  }

  loadData(): Promise<Object> {
    if (!this.comsCheck()) {
      return new Promise((res, rej) => rej());
    } else {
      return window.comms.loadData();
    }
  }

  exportData(logTree: Map<string, Map<number, Map<number, TaskLog>>>) {
    if (!this.comsCheck()) return;
    return window.comms.exportData(logTree);
  }

  newTask(task: NewTask) {
    if (!this.comsCheck()) return;
    return window.comms.newTask(task);
  }

  toggleTask(id: number, newState: TaskStatus, currentTime: number) {
    if (!this.comsCheck()) return;
    return window.comms.toggleTask(id, newState, currentTime);
  }

  editTask(newTask: Task) {
    if (!this.comsCheck()) return;
    return window.comms.editTask(newTask);
  }

  editProject(newProject: Project) {
    if (!this.comsCheck()) return;
    return window.comms.editProject(newProject);
  }

  newHabit(habit: Habit) {
    if (!this.comsCheck()) return;
    return window.comms.newHabit(habit);
  }

  editHabit(newHabit: Habit) {
    if (!this.comsCheck()) return;
    return window.comms.editHabit(newHabit);
  }

  habitDone(id: number, time: number) {
    if (!this.comsCheck()) return;
    return window.comms.habitDone(id, time);
  }

  deleteHabit(id: number) {}
}