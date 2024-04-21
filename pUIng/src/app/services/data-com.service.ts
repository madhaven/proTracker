import { Task } from '../models/task.model';
import { NewTask } from '../models/new-task.model';
import { Injectable } from '@angular/core';
import { TaskStatus } from '../common/task-status';

@Injectable({
  providedIn: 'root'
})
export abstract class DataComService {

  newTask(newTask: NewTask): any {}
  editTask(newTask: Task): any {}
  toggleTask(id: number, newState: TaskStatus, currentTime: number): any {}
  createHabit(): any {}
  habitDone(id: number): any {}
  deleteHabit(id: number): any {}
  editProject(): any {}
  loadData(): any {}
}
