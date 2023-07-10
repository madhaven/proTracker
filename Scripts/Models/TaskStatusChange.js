const TaskStatusChange = class {
    constructor (id, taskId, changeTo, dateTime){
        this.id = id
        this.taskId = taskId
        this.changeTo = changeTo
        this.dateTime = dateTime
    }
}

module.exports = { TaskStatusChange }