const Habit = class {
    constructor (
        id
        , name
        , removed
        , startTime
        , endTime
        , days
        , lastLogTime
    ) {
        this.id = id
        this.name = name
        this.removed = removed
        this.startTime = startTime
        this.endTime = endTime
        this.days = days
        this.lastLogTime = lastLogTime
    }
}

module.exports = { Habit }