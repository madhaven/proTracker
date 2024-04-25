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

    taskLog (log, task, project) {
        this.tasks[task.id] ??= task
        this.projects[project.id] ??= project
        this.addLog(log)
        console.debug('data added', this)
    }
}