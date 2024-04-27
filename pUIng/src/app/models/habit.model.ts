export class Habit {
    id!: number;
    name!: string;
    removed!: boolean; // TODO: unnecassary field
    startTime!: number;
    endTime!: number | null;
    days!: number;
    lastLogTime!: number;
}
