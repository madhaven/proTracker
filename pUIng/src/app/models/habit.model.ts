export class Habit {
    id!: number
    name!: string
    removed!: boolean // TODO: unnecassary field
    startTime!: number
    endTime!: number
    days!: number
    lastLogTime!: number
}
