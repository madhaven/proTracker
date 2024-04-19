import { Injectable } from '@angular/core';
import { TaskStatus } from '../common/task-status';
import { NewTask } from '../models/new-task.model';
import { UiStateService } from './ui-state.service';

@Injectable({
  providedIn: 'root'
})
export abstract class DataComService {

  newTask(newTask: NewTask): any {}
  editTask(newTask: NewTask): any {}
  toggleTask(id: number, newState: TaskStatus, currentTime: number): any {}
  createHabit(): any {}
  habitDone(id: number): any {}
  deleteHabit(id: number): any {}
  editProject(): any {}
  loadData(): any {}
}
