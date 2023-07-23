class TaskLog {
    constructor (
        id = -1,
        dateTime,
        summary,
        parentId = -1,
        projectId,
        projectName,
        statusId,
        statusName,
    ){
        this.id = id,
        this.dateTime = dateTime,
        this.summary = summary,
        this.parentId = parentId,
        this.projectId = projectId,
        this.projectName = projectName,
        this.statusId = statusId,
        this.statusName = statusName
    }
}

module.exports = { TaskLog }