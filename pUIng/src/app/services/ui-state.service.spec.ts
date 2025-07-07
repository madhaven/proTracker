import { TestBed } from '@angular/core/testing';

import { UiStateService } from './ui-state.service';
import { TaskLog } from '../models/task-log.model';
import { Task } from '../models/task.model';
import { Project } from '../models/project.model';

describe('UiStateService', () => {
  let service: UiStateService;

  beforeEach(() => {
    service = TestBed.inject(UiStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should grow tress properly', () => {
    service.logs = new Map([
      [0, new TaskLog(0, 0, 1, 1751450644621)],
      [1, new TaskLog(1, 0, 4, 1751450646349)],
      [2, new TaskLog(2, 0, 1, 1751450646868)],
      [3, new TaskLog(3, 0, 4, 1751450647319)],
      [4, new TaskLog(4, 0, 1, 1751450647767)],
      [5, new TaskLog(5, 1, 1, 1751451024365)],
      [6, new TaskLog(6, 2, 1, 1751451029021)],
      [7, new TaskLog(7, 3, 1, 1751451086949)],
    ]);
    service.tasks = new Map([
      [0, new Task(0, 0, -1, "asdfasdf")],
      [1, new Task(1, 1, -1, "asd")],
      [2, new Task(2, 1, -1, "asd")],
      [3, new Task(3, 1, -1, "kjhkhkjh")],
    ]);
    service.projects = new Map([
      [0, new Project(0, "asdf", [])],
      [1, new Project(1, "sdg", [])],
    ]);
    service.growTrees();
    console.log(service.logTree);
    var date = service._getDateStr(new Date());
    expect(service.logTree).toEqual(new Map([
      [ '2025,6,2', new Map([
        [0, new Map([[0, new TaskLog(4, 0, 1, 1751450647767)]])],
        [1, new Map([
          [1, new TaskLog(5, 1, 1, 1751451024365)],
          [2, new TaskLog(6, 2, 1, 1751451029021)],
          [3, new TaskLog(7, 3, 1, 1751451086949)],
        ])],
      ])],
      [ date, new Map([
        [0, new Map([[0, new TaskLog(4, 0, 1, 1751450647767)]])],
        [1, new Map([
          [1, new TaskLog(5, 1, 1, 1751451024365)],
          [2, new TaskLog(6, 2, 1, 1751451029021)],
          [3, new TaskLog(7, 3, 1, 1751451086949)],
        ])],
      ])],
    ]));
  });
});
