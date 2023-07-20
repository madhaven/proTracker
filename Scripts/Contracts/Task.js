class Task {
    constructor (
        id = -1,
        summary,
        parentId = -1,
        projectId,
    ){
        this.id = id
        this.summary = summary
        this.parentId = parentId
        this.projectId = projectId
    }
}

module.exports = { Task }