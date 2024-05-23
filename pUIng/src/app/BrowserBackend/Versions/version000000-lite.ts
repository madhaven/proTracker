import { BrowserDataObject } from "../../models/browser-data-object.model";
import { LocalStorageVersionInterface } from "../local-storage-version-interface";

export class Version000000Lite implements LocalStorageVersionInterface {

  lsVersion: string = "Lite";
  previousVersion = undefined;

  read(data: any): BrowserDataObject {
    if ( !Object.hasOwn(data, "tasks")
      || !Object.hasOwn(data, "taskLogs")
      || !Object.hasOwn(data, "projects")
      || !Object.hasOwn(data, "habits")
      || !Object.hasOwn(data, "habitLogs")
      || !Object.hasOwn(data, "lsVersion"))
      throw Error("Corrupt Data received");
    
      var result = new BrowserDataObject(
      data.tasks,
      data.taskLogs,
      data.projects,
      data.habits,
      data.habitLogs,
      this.lsVersion,
    )
    return result;
  }

  setup(): BrowserDataObject {
    return new BrowserDataObject([], [], [], [], [], this.lsVersion);
  }

  getExportableData(data: BrowserDataObject): any {
    var exportableData = {
      "tasks": data.tasks,
      "taskLogs": data.taskLogs,
      "projects": data.projects,
      "habits": data.habits,
      "habitLogs": data.habitLogs,
      "lsVersion": this.lsVersion,
    }
    return exportableData;
  }

  isMatch(version: string): boolean {
    return this.lsVersion === version;
  }
}
