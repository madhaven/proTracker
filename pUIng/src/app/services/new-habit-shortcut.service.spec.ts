import { TestBed } from '@angular/core/testing';

import { NewHabitShortcutService } from './new-habit-shortcut.service';

describe('NewHabitShortcutService', () => {
  let service: NewHabitShortcutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewHabitShortcutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
