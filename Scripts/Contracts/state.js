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
        this.logTree = {}
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
        this.growTree()
        console.debug('data replaced', this)
    }

    addData (log, task, project) {
        if (this.tasks[task.id] == undefined) {
            this.tasks[task.id] = task
        }
        if (this.projects[project.id] == undefined) {
            this.projects[project.id] = project
        }
        this.addLog(log)
        console.debug('data added', this)
    }

    addLog (log) {
        this.logs[log.id] = log
        this.growTree()
        console.log('log added', this)
    }
    
    growTree () {
        this.logTree = {}
        const orderredLogs = []
        const pendingLogs = new Map()

        for (const log in this.logs) {
            orderredLogs.push(this.logs[log])
        }
        orderredLogs.sort((a, b) => a.dateTime-b.dateTime)

        for (const log of orderredLogs) {
            const t = new Date(log.dateTime)
                , year = t.getFullYear()
                , month = t.getMonth()
                , date = t.getDate()
            if (this.logTree[[year, month, date]] == undefined)
                this.logTree[[year, month, date]] = {}
            this.logTree[[year, month, date]][log.taskId] = log
            if (log.statusId == 1)
                pendingLogs.set(log.taskId, log)
            else
                pendingLogs.delete(log.taskId)
        }

        const t2 = new Date()
        const today = [t2.getFullYear(), t2.getMonth(), t2.getDate()]
        for (const [taskId, log] of pendingLogs) {
            if (this.logTree[today] == undefined)
                this.logTree[today] = {}
            this.logTree[today][taskId] = log
        }
    }
}