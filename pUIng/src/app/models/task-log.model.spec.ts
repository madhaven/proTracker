import { TaskLog } from './task-log.model';

describe('TaskLog', () => {
  it('should create an instance', () => {
    expect(new TaskLog(-1, 1, 1, 123)).toBeTruthy();
  });
});
