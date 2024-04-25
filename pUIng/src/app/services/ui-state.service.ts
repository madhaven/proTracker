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
import { NewTask } from '../models/new-task.model';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {

  // preferences
  foldedProjects = new Map<number, boolean>()
  defaultTab: MenuTabs = MenuTabs.TaskLogs
  dataProfile: boolean = true
  idleTolerance: number = 500 // TODO: ng fix

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

  logsExist() {
    return this.logs.size > 0
  }

  toggleFold(projectId: number): boolean {
    var currentFold = this.foldedProjects.get(projectId) ?? false
    this.foldedProjects.set(projectId, !currentFold)
    return !currentFold
  }

  getTask(taskId: number): Task | undefined {
    return this.tasks.get(taskId)
  }

  newTask(newTask: NewTask) {
    this.comService.newTask(newTask).then(
      (res: any) => { // TODO: ng standardise data models
        if (res == false) return
        this.tasks.set(res.task.id, res.task)
        this.projects.set(res.project.id, res.project)
        this.logs.set(res.log.id, res.log)
        this.growTrees()
      },
      (err: any) => {
        console.error('server error while adding new task') // TODO notification
      }
    )
  }

  toggleTask(taskId: number, newState: TaskStatus, currentTime: number) {
    this.comService.toggleTask(taskId, newState, currentTime).then(
      (res: TaskLog|boolean) => {
        if (res as boolean == false) return
        res = res as TaskLog
        this.logs.set(res.id, res)
        this.growTrees()
      },
      (err: any) => {
        console.error('server error while updating task') // TODO remove error logs
      }
    )
  }

  editTask(taskId: number, newSummary: string) {
    var newTask = this.tasks.get(taskId)
    newTask!.summary = newSummary
    this.comService.editTask(newTask!).then(
      (res: Task|boolean) => { // TODO: document responses
        if (res as boolean == false) {
          console.error('Something went wrong while editing task') // TODO notification
        } else {
          res = res as Task
          this.tasks.set(taskId, newTask!)
        }
      },
      (err: any) => {
        console.error('Unable to edit Task due to an internal error') // TODO notification
      }
    )
  }

  getProject(projectId: number): Project | undefined {
    return this.projects.get(projectId)
  }

  editProject(projectId: number, newName: string) {
    var newProject = this.projects.get(projectId)
    newProject!.name = newName
    this.comService.editProject(newProject!).then(
      (res: any) => {
        if (res) {
          this.projects.set(projectId, newProject!)
        } else {
          // TODO: create structured responses, false values limits the reasons for failure
          // console.warn('Yo wtf, that name already exists!')
          console.error(`Something went wrong while editing project`) // TODO: CREATE APP NOTIFICATION
        }
      },
      (err: any) => {
        console.error('Unable to edit Project due to an internal error')
      }
    )
  }

  getHabit(habitId: number): Habit | undefined {
    return this.habits.get(habitId)
  }

  newHabit(
    title: string,
    frequency: number,
    startTime: number = Date.now(),
    endTime: number = Infinity
  ) {
    // title, Date.now(), Infinity, frequency
    var newHabit: Habit = {
      id: -1,
      name: title,
      days: frequency,
      startTime: startTime,
      endTime: endTime
    } as Habit

    this.comService.newHabit(newHabit).then(
      (res: Habit|boolean) => {
        if (res as boolean == false) {
          console.error('Habit invalid')
          return
        } else {
          res = res as Habit
          this.habits.set(res.id, res)
        }
      },
      (err: any) => {
        console.error('servor errored while adding habit', err) // TODO notification
      }
    )
  }

  markHabitDone(habit: Habit) {
    this.comService.habitDone(habit.id, Date.now()).then(
      (res: HabitLog|boolean) => {
        if (res as boolean == false) {
          console.error('Unable to mark Habit as done due to some error')
          return
        } else {
          res = res as HabitLog
          this.habitLogs.set(res.id, res)
          this.habits.get(res.habitId)!.lastLogTime = res.dateTime
        }
      },
      (err: any) => {
        console.error('server error while updating habit', err) // TODO notification
      }
    )
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
    tasks: [Task], 
    taskLogs: [TaskLog], 
    projects: [Project], 
    habits: [Habit], 
    habitLogs: [HabitLog],
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
