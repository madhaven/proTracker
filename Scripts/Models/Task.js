const { Task: TaskContract } = require('../Contracts/Task')
const { ProjectProvider } = require('../Providers/ProjectProvider')
const { StatusProvider } = require('../Providers/StatusProvider')
const { StatusLogProvider } = require('../Providers/StatusLogProvider')

const Task = class {
    constructor (id, projectId, summary, parentId){
        this.id = id,
        this.projectId = projectId
        this.summary = summary
        this.parentId = parentId
    }

    async toContract (latestLog = undefined) {
        // TODO DI ?
        var project = await new ProjectProvider().get(this.projectId)
        var logs = latestLog ? [latestLog] : await new StatusLogProvider().getTaskTimeline(this.id)
        console.log(logs)
        // var logs = logs.map(log => new StatusProvider().get(log.statusId).status)
        return {
            id: this.id,
            project: project,
            summary: this.summary,
            logs: logs,
            parent: this.parentId
        }
    }
}

module.exports = { Task }