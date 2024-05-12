import { HabitLog } from './habit-log.model';

describe('HabitLog', () => {
  it('should create an instance', () => {
    expect(new HabitLog(-1, 5, 123)).toBeTruthy();
  });
});
