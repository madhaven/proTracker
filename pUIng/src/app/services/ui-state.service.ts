import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Habit } from '../models/habit.model';
import { Project } from '../models/project.model';
import { TaskLog } from '../models/task-log.model';
import { HabitLog } from '../models/habit-log.model';
import { MenuTabs } from '../common/menu-tabs';
import { TaskStatus } from '../common/task-status';

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
  
  // constructor() {
  //   this.logs = new Map<number, TaskLog>([
  //     [1, {"id":1,"taskId":1,"statusId":1,"dateTime":1708861629507}],
  //     [2, {"id":2,"taskId":1,"statusId":4,"dateTime":1710667805211}],
  //     [3, {"id":3,"taskId":2,"statusId":1,"dateTime":1711006994475}],
  //     [4, {"id":4,"taskId":2,"statusId":4,"dateTime":1711007023601}],
  //     [5, {"id":5,"taskId":2,"statusId":1,"dateTime":1711007024305}],
  //     [6, {"id":6,"taskId":2,"statusId":4,"dateTime":1711019619589}],
  //     [7, {"id":7,"taskId":2,"statusId":1,"dateTime":1711019620107}],
  //     [8, {"id":8,"taskId":2,"statusId":4,"dateTime":1711023591436}],
  //     [9, {"id":9,"taskId":2,"statusId":1,"dateTime":1711023591892}],
  //     [10, {"id":10,"taskId":2,"statusId":4,"dateTime":1711028226730}],
  //     [11, {"id":11,"taskId":2,"statusId":1,"dateTime":1711028227195}],
  //     [12, {"id":12,"taskId":2,"statusId":4,"dateTime":1711032862977}],
  //     [13, {"id":13,"taskId":2,"statusId":1,"dateTime":1711032863583}],
  //   ])
  //   this.logTree = new Map<string, Map<number, Map<number, TaskLog>>>([
  //     ["2024,1,25", new Map([[1, new Map([[1, {"id":1,"taskId":1,"statusId":1,"dateTime":1708861629507}]])]])],
  //     ["2024,2,17", new Map([[1, new Map([[1, {"id":2,"taskId":1,"statusId":4,"dateTime":1710667805211}]])]])],
  //     ["2024,2,21", new Map([[1, new Map([[2, {"id":13,"taskId":2,"statusId":1,"dateTime":1711032863583}]])]])],
  //     ["2024,2,30", new Map([[1, new Map([[2, {"id":13,"taskId":2,"statusId":1,"dateTime":1711032863583}]])]])],
  //   ])
  //   this.tasks = new Map<number, Task>([
  //     [1, {"id":1, "projectId":1, "summary":"aa", "parentId":-1}],
  //     [2, {"id":2, "projectId":1, "summary":"llkjhasdf", "parentId":-1}],
  //   ])
  //   this.projects = new Map<number, Project>([
  //     [1, {"id": 1, "name": "test Project 1", "tasks": []}],
  //     [2, {"id": 2, "name": "test Project 2", "tasks": []}]
  //   ])
  //   this.projectTree = new Map<number, Map<number, number>>([
  //     [1, new Map<number, number>([[1, 1], [2, 4]])],
  //     [2, new Map<number, number>()]
  //   ])
  //   this.foldedProjects = new Map<number, boolean>();
  //   this.habits = new Map<number, Habit>([
  //     [1, {"id":1, "name": "test", "days": 5, "lastLogTime": 0, "endTime": null, "removed": false, "startTime": 1}],
  //     [2, {"id":2, "name": "testHabit 2", "days": 2, "lastLogTime": 0, "endTime": null, "removed": false, "startTime": 1}]
  //   ])
  // }

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

  growTrees () {
    var orderredLogs = [...this.logs.values()]
    var pendingLogs = new Map<Task, TaskLog>()
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
