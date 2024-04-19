import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Habit } from '../models/habit.model';
import { Project } from '../models/project.model';
import { TaskLog } from '../models/task-log.model';
import { HabitLog } from '../models/habit-log.model';
import { MenuTabs } from '../common/menu-tabs';
import { TaskStatus } from '../common/task-status';
import { DataComService } from './data-com.service';
import { ElectronComService } from './electron-com.service';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  // preferences
  foldedProjects = new Map<number, boolean>()
  menuVisible: boolean = true
  currentTab: MenuTabs = MenuTabs.TaskLogs
  dataProfile: boolean = true
  inactiveDuration: number = 0 // TODO: ng fix
  inactivityTolerance: number = 500 // TODO: ng fix

  // data
  tasks = new Map<number, Task>()
  habits = new Map<number, Habit>()
  projects = new Map<number, Project>()
  logs = new Map<number, TaskLog>()
  habitLogs = new Map<number, HabitLog>()
  logTree = new Map<string, Map<number, Map<number, TaskLog>>>()
  projectTree = new Map<number, Map<number, number>>()

  // deps
  comService!: DataComService

  constructor(eComService: ElectronComService) {
    this.comService = eComService
  }

  getLogTree() {
    return this.logTree
  }

  getProjectTree() {
    return this.projectTree
  }

  logsExist() {
    return this.logs.size > 0
  }

  switchTab(tab: MenuTabs) {
    this.currentTab = tab
  }

  toggleFold(projectId: number): boolean {
    var currentFold = this.foldedProjects.get(projectId) ?? false
    this.foldedProjects.set(projectId, !currentFold)
    return !currentFold
  }

  getTask(taskId: number): Task | undefined {
    return this.tasks.get(taskId)
  }

  getProject(projectId: number): Project | undefined {
    return this.projects.get(projectId)
  }

  getHabit(habitId: number): Habit | undefined {
    return this.habits.get(habitId)
  }

  getHabitsDueOn(today: Date): Map<number, Habit> {
    var dueHabits = new Map<number, Habit>()
    for (let [id, habit] of this.habits) {
      var lastLog = new Date(habit.lastLogTime)
      if (lastLog.getFullYear() != today.getFullYear()
      || lastLog.getMonth() != today.getMonth()
      || lastLog.getDate() != today.getDate()) {
        dueHabits.set(id, habit)
      } else {
        dueHabits.delete(id)
      }
    }
    return dueHabits
  }

  newTask(log: TaskLog, task: Task, project: Project) {
    this.tasks.set(task.id, task)
    this.projects.set(project.id, project)
    this.logs.set(log.id, log)
    this.growTrees()
  }

  toggleTask(taskId: number, newState: TaskStatus, currentTime: number) {
    this.comService.toggleTask(taskId, newState, currentTime).then(
      (res: TaskLog) => {
        this.logs.set(res.id, res)
        this.growTrees()
      },
      (err: any) => {
        console.error('server error while updating task') // TODO remove error logs
      }
    )
  }

  growTrees() {
    var pendingLogs = new Map<Task, TaskLog>()
    var orderredLogs = [...this.logs.values()]
    orderredLogs.sort((a, b) => a.dateTime-b.dateTime)

    orderredLogs.forEach(log => {
      const t = new Date(log.dateTime)
        , year = t.getFullYear()
        , month = t.getMonth()
        , date = t.getDate()
        , task = this.tasks.get(log.taskId)
        , project = this.projects.get(task!.projectId)
        , dateStr = `${year},${month},${date}`
      
      if (!this.logTree.has(dateStr))
        this.logTree.set(dateStr, new Map())
      if (!this.logTree.get(dateStr)?.has(project!.id))
        this.logTree.get(dateStr)?.set(project!.id, new Map())
      this.logTree.get(dateStr)?.get(project!.id)?.set(task!.id, log)

      if (log.statusId == TaskStatus.PENDING)
        pendingLogs.set(task!, log)
      else
        pendingLogs.delete(task!)
      
      if (!this.projectTree.has(project!.id))
        this.projectTree.set(project!.id, new Map())
      this.projectTree.get(project!.id)?.set(task!.id, log.statusId)
    })

    // show pending tasks on current date
    const today = new Date()
      , todayStr = `${today.getFullYear()},${today.getMonth()},${today.getDate()}`
    pendingLogs.forEach((log: TaskLog, task: Task) => {
      if (!this.logTree.has(todayStr))
        this.logTree.set(todayStr, new Map())
      if (!this.logTree.get(todayStr)?.has(task.projectId))
        this.logTree.get(todayStr)?.set(task.projectId, new Map())
      this.logTree.get(todayStr)?.get(task.projectId)?.set(task.id, log)
    })
  }

  loadData() {
    this.comService.loadData().then(
      (res: any) => {
        if (res){
          console.log('data recieved from db', res)
          this.replaceData(res.tasks, res.taskLogs, res.projects, res.habits, res.habitLogs)
        } else {
          console.error('corrupt data received', res)
          // TODO: notification ?
        }
      },
      (err: any) => console.error('server error while loading data') // TODO notification
    )
  }

  replaceData(
    tasks: any, 
    taskLogs: any, 
    projects: any, 
    habits: any, 
    habitLogs: any
  ) {
    this.logs = new Map()
    this.tasks = new Map()
    this.habits = new Map()
    this.projects = new Map()
    this.habitLogs = new Map()
    
    for (var log of taskLogs) { this.logs.set(log.id, log) }
    for (var task of tasks) { this.tasks.set(task.id, task) }
    for (var habit of habits) { this.habits.set(habit.id, habit) }
    for (var project of projects) { this.projects.set(project.id, project) }
    for (var habitLog of habitLogs) { this.habitLogs.set(habitLog.id, habitLog) }

    this.growTrees()
    console.debug('state updated', this)
  }
}
