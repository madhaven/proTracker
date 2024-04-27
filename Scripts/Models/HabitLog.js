const HabitLog = class {
    constructor(
        id
        , habitId
        , dateTime
    ) {
        this.id = id
        this.habitId = habitId
        this.dateTime = dateTime
    }
}

module.exports = { HabitLog }