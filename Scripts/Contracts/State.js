const State = class {
    // Intended to keep track of the Webpage state
    // All UI should be loadable from an instance of this class

    constructor (
        menuVisible=true,
        dataProfile=true,
    ) {
        this.menuVisible = menuVisible
        this.dataProfile = dataProfile
        this.logs = {}
        this.tasks = {}
        this.projects = {}
        this.habits = {}
        this.habitLogs = {}
        this.logTree = {} // date > projectId > taskId > log
        this.projectTree = {} // projectId > taskId > stateId
    }

    equals (state2) {
        if (typeof(state2) != typeof(this))
            return false
        if (this.menuView != state2.menuView 
            || this.dataProfile != state2.dataFile)
            return false
        if (this.logs.length != state2.logs.length)
            return false
        for (var i=0; i<this.logs.length; i++) {
            if (this.logs[i] != state2.logs[i])
                return false
        }
        return true
    }

    replaceData (tasks, taskLogs, projects, habits, habitLogs) {
        this.projects = {}
        this.tasks = {}
        this.logs = {}
        this.habits = {}
        this.habitLogs = {}
        
        for (var project of projects) { this.projects[project.id] = project }
        for (var task of tasks) { this.tasks[task.id] = task }
        for (var log of taskLogs) { this.logs[log.id] = log }
        for (var habit of habits) { this.habits[habit.id] = habit }
        for (var habitLog of habitLogs) { this.habitLogs[habitLog.id] = habitLog }

        this.growTrees()
        console.debug('state updated', this)
    }

    taskLog (log, task, project) {
        this.tasks[task.id] ??= task
        this.projects[project.id] ??= project
        this.addLog(log)
        console.debug('data added', this)
    }

    addLog (log) {
        this.logs[log.id] = log
        this.growTrees()
    }

    addHabit (habit) {
        this.habits[habit.id] = habit
    }

    addHabitLog (habitLog) {
        this.habitLogs[habitLog.id] = habitLog
    }
}