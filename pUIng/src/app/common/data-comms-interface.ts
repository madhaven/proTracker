import { Task } from '../models/task.model';
import { Project } from '../models/project.model';
import { NewTaskData } from '../models/new-task-data.model';
import { TaskStatus } from '../common/task-status';
import { Habit } from '../models/habit.model';
import { TaskLog } from '../models/task-log.model';
import { BrowserDataObject } from '../models/browser-data-object.model';

export interface DataCommsInterface {
  newTask(newTask: NewTaskData): any;
  editTask(newTask: Task): any;
  toggleTask(id: number, newState: TaskStatus, currentTime: number): any;
  newHabit(newHabit: Habit): any;
  editHabit(newHabit: Habit): any;
  habitDone(id: number, time: number): any;
  deleteHabit(id: number): any;
  editProject(newProject: Project): any;
  loadData(): Promise<BrowserDataObject|false>;
  exportData(logTree: Map<string, Map<number, Map<number, TaskLog>>>): any;
}