import { Injectable } from "@angular/core";
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

  constructor (uiStateService: UiStateService) {
    super(uiStateService)
  }

  override newTask(task: NewTask) {
    if (!window.comms) { console.error("DataComs Down") }
    return window.comms.newTask(task)
  }


}