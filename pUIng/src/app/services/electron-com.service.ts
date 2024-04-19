import { Injectable } from "@angular/core";
import { TaskStatus } from "../common/task-status";
import { NewTask } from "../models/new-task.model";
import { DataComService } from "./data-com.service";
import { UiStateService } from "./ui-state.service";

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
}