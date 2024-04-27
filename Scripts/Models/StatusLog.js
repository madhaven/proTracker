const StatusLog = class {
    constructor (
        id
        , taskId
        , status_id
        , dateTime
    ) {
        this.id = id
        this.taskId = taskId
        this.statusId = status_id
        this.dateTime = dateTime
    }
}

module.exports = { StatusLog }