const Status = class {
    static PENDING = 1
    static IN_PROGRESS = 2
    static NEED_INFO = 3
    static COMPLETED = 4
    static WAITING = 5
    static WONT_DO = 6
}

module.exports = { Status }