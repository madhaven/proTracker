const Task = class {
    constructor (id, dateTime, project, summary, status, parent){
        this.id = id
        this.dateTime = dateTime,
        this.project = project
        this.summary = summary
        this.status = status
        this.parent = parent
    }
}