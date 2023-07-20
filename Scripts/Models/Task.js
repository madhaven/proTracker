const Task = class {
    constructor (id, projectId, summary, parentId) {
        this.id = id,
        this.projectId = projectId
        this.summary = summary
        this.parentId = parentId
    }
}

module.exports = { Task }