const { Task: TaskContract } = require('../Contracts/Task')
const { ProjectProvider } = require('../Providers/ProjectProvider')
const { StatusProvider } = require('../Providers/StatusProvider')

const Task = class {
    constructor (id, dateTime, projectId, summary, status, parent){
        this.id = id,
        this.dateTime = dateTime,
        this.projectId = projectId
        this.summary = summary
        this.status = status
        this.parent = parent
    }

    async toContract () {
        var x = await (new ProjectProvider()).get(this.projectId)
        var y = await (new StatusProvider()).get(this.status)
        return {
            id: this.id,
            dateTime: this.dateTime,
            project: x.name,
            summary:this.summary,
            status: y.status,
            parent:this.parent
        }
    }
}

module.exports = { Task }