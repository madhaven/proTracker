import { Task } from './task.model';

describe('Task', () => {
  it('should create an instance', () => {
    expect(new Task(-1, 1, 2, 'test')).toBeTruthy();
  });
});
