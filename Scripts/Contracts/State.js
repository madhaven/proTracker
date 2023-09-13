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

    replaceData (logs, tasks, projects) {
        this.projects = {}
        this.tasks = {}
        this.logs = {}
        
        for (var project of projects) {
            this.projects[project.id] = project
        }
        for (var task of tasks) {
            this.tasks[task.id] = task
        }
        for (var log of logs) {
            this.logs[log.id] = log
        }
        this.growTrees()
        console.debug('data replaced', this)
    }

    addData (log, task, project) {
        this.tasks[task.id] ??= task
        this.projects[project.id] ??= project
        this.addLog(log)
        console.debug('data added', this)
    }

    addLog (log) {
        this.logs[log.id] = log
        this.growTrees()
    }
    
    growTrees () {
        this.logTree = {}
        this.projectTree = {}
        const orderredLogs = []
        const pendingLogs = new Map()

        for (const log in this.logs) {
            orderredLogs.push(this.logs[log]) // TODO: one-liner instead of looping
        }
        orderredLogs.sort((a, b) => a.dateTime-b.dateTime)

        for (const log of orderredLogs) {
            const t = new Date(log.dateTime)
                , year = t.getFullYear()
                , month = t.getMonth()
                , date = t.getDate()
                , task = this.tasks[log.taskId]
                , project = this.projects[task.projectId]
            this.logTree[[year, month, date]] ??= {}
            this.logTree[[year, month, date]][project.id] ??= {}
            this.logTree[[year, month, date]][project.id][task.id] = log
            if (log.statusId == 1)
                pendingLogs.set(task, log)
            else
                pendingLogs.delete(task)
    
            this.projectTree[project.id] ??= {}
            this.projectTree[project.id][task.id] = log.statusId
        }

        // show pending tasks on current date
        const t2 = new Date()
        const today = [t2.getFullYear(), t2.getMonth(), t2.getDate()]
        for (const [task, log] of pendingLogs) {
            this.logTree[today] ??= {}
            this.logTree[today][task.projectId] ??= {}
            this.logTree[today][task.projectId][task.id] = log
        }
    }
}