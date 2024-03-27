import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Habit } from '../models/habit.model';
import { Project } from '../models/project.model';
import { TaskLog } from '../models/task-log.model';
import { HabitLog } from '../models/habit-log.model';

@Injectable()
export class UiStateService {

  // preferences
  foldedProjects!: Map<number, boolean>;
  menuVisible!: boolean
  dataProfile!: boolean
  inactiveDuration!: number
  inactivityTolerance!: number

  // data
  tasks!: Map<number, Task>
  habits!: Map<number, Habit>
  projects!: Map<number, Project>
  logs!: Map<number, TaskLog>
  habitLogs!: Map<number, HabitLog>
  logTree!: Map<string, Map<number, Map<number, TaskLog>>>
  projectTree!: Map<number, Map<number, number>>
  
  constructor() {}
}
