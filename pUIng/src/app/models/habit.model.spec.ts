import { Habit } from './habit.model';

describe('Habit', () => {
  it('should create an instance', () => {
    expect(new Habit(-1, 'test', false, 123, 1234, 5, 124)).toBeTruthy();
  });
});
