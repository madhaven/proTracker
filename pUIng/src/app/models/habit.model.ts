export class Habit {
    id!: number;
    name!: string;
    removed!: boolean;
    startTime!: number;
    endTime!: number | null;
    days!: number;
    lastLogTime!: number;

    constructor(
        id: number,
        name: string,
        removed: boolean,
        startTime: number,
        endTime: number | null,
        days: number,
        lastLogTime: number,
    ) {
        this.id = id;
        this.name = name;
        this.removed = removed;
        this.startTime = startTime;
        this.endTime = endTime;
        this.days = days;
        this.lastLogTime = lastLogTime;
    }
}
