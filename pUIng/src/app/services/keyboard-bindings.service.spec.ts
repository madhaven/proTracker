import { TestBed } from '@angular/core/testing';

import { KeyboardBindingsService } from './keyboard-bindings.service';
import { Shortcuts } from '../common/shortcuts';

describe('KeyboardBindingsService', () => {
  let service: KeyboardBindingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new KeyboardBindingsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getShortcut should return correct value', () => {
    expect(service.getShortcut(Shortcuts.MainMenu)).toBe("window:keydown.alt.shift.m");
    expect(service.getShortcut(Shortcuts.NewEntry)).toBe("window:keydown.alt.shift.n");
    expect(service.getShortcut(Shortcuts.ShiftToHabitsTab)).toBe("window:keydown.alt.shift.h");
    expect(service.getShortcut(Shortcuts.ShiftToLogsTab)).toBe("window:keydown.alt.shift.l");
    expect(service.getShortcut(Shortcuts.ShiftToProjectsTab)).toBe("window:keydown.alt.shift.p");
  });

  it('getKeyString should return correct value', () => {
    expect(service.getKeyString(Shortcuts.MainMenu)).toBe("Alt Shift M");
    expect(service.getKeyString(Shortcuts.NewEntry)).toBe("Alt Shift N");
    expect(service.getKeyString(Shortcuts.ShiftToHabitsTab)).toBe("Alt Shift H");
    expect(service.getKeyString(Shortcuts.ShiftToLogsTab)).toBe("Alt Shift L");
    expect(service.getKeyString(Shortcuts.ShiftToProjectsTab)).toBe("Alt Shift P");
  })
});
