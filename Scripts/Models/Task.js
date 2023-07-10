const Task = class {
    constructor (id, projectId, summary, status, parent){
        this.id = id
        this.projectId = projectId
        this.summary = summary
        this.status = status
        this.parent = parent
    }

    doshit(){
        console.log("doing shit")
    }
}