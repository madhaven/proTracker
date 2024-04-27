import { Task } from '../models/task.model';
import { Project } from '../models/project.model';
import { NewTask } from '../models/new-task.model';
import { Injectable } from '@angular/core';
import { TaskStatus } from '../common/task-status';
import { Habit } from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export abstract class DataComService {
  newTask(newTask: NewTask): any {}
  editTask(newTask: Task): any {}
  toggleTask(id: number, newState: TaskStatus, currentTime: number): any {}
  newHabit(newHabit: Habit): any {}
  editHabit(newHabit: Habit): any {}
  habitDone(id: number, time: number): any {}
  deleteHabit(id: number): any {}
  editProject(newProject: Project): any {}
  loadData(): any {}
}
