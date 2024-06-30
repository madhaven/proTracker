import { TestBed } from '@angular/core/testing';

import { NewLogShortcutService } from './new-log-shortcut.service';

describe('NewLogShortcutService', () => {
  let service: NewLogShortcutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewLogShortcutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
