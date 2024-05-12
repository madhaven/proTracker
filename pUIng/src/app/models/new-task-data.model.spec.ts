import { NewTaskData } from './new-task-data.model';

describe('NewTask', () => {
  it('should create an instance', () => {
    expect(new NewTaskData(-1, 123, 'test', 'test')).toBeTruthy();
  });
});
