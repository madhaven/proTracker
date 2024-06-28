export class HabitLog {
    id!: number;
    habitId!: number;
    dateTime!: number;

    constructor(
        id: number,
        habitId: number,
        dateTime: number,
    ) {
        this.id = id;
        this.habitId = habitId;
        this.dateTime = dateTime;
    }
}
