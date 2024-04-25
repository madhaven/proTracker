import { Task } from "../models/task.model";
import { Project } from "../models/project.model";
import { NewTask } from "../models/new-task.model";
import { Injectable } from "@angular/core";
import { TaskStatus } from "../common/task-status";
import { DataComService } from "./data-com.service";
import { Habit } from "../models/habit.model";

declare global {
  interface Window {
    comms: any;
  }
}

@Injectable({ providedIn: 'root' })
export class ElectronComService extends DataComService {

  comsCheck() {
    if (!window.comms) {
      console.error("DataComs Down")
      return false
    }
    return true
  }

  override loadData() {
    return window.comms.loadData()
  }

  override newTask(task: NewTask) {
    if (!this.comsCheck()) return
    return window.comms.newTask(task)
  }

  override toggleTask(id: number, newState: TaskStatus, currentTime: number) {
    if (!this.comsCheck()) return
    return window.comms.toggleTask(id, newState, currentTime)
  }

  override editTask(newTask: Task) {
    if (!this.comsCheck()) return
    return window.comms.editTask(newTask)
  }

  override editProject(newProject: Project) {
    if (!this.comsCheck()) return
    return window.comms.editProject(newProject)
  }

  override newHabit(habit: Habit) {
    if (!this.comsCheck()) return
    return window.comms.newHabit(habit)
  }
}