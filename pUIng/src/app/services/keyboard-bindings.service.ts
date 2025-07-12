import { Injectable } from '@angular/core';
import { Shortcuts } from '../common/shortcuts';

@Injectable({
  providedIn: 'root'
})
export class KeyboardBindingsService {

  bindings = new Map<Shortcuts, string[]>([
    [Shortcuts.MainMenu, ["window:keydown.alt.shift.m", "Alt Shift M"]],
    [Shortcuts.NewEntry, ["window:keydown.alt.shift.n", "Alt Shift N"]],
    [Shortcuts.ShiftToTodoTab, ["window:keydown.alt.shift.t", "Alt Shift T"]],
    [Shortcuts.ShiftToHabitsTab, ["window:keydown.alt.shift.h", "Alt Shift H"]],
    [Shortcuts.ShiftToLogsTab, ["window:keydown.alt.shift.l", "Alt Shift L"]],
    [Shortcuts.ShiftToProjectsTab, ["window:keydown.alt.shift.p", "Alt Shift P"]],
  ]);
  keyStrings = new Map<Shortcuts, string>([
  ]);

  constructor() {
    // TODO: load shortcuts from preferences #56
  }

  getShortcut (shortcut: Shortcuts): string {
    return this.bindings.get(shortcut)?.[0] ?? "";
  }

  getKeyString (shortcut: Shortcuts): string {
    return this.bindings.get(shortcut)?.[1] ?? "";
  }
}
