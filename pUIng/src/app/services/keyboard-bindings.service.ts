import { Injectable } from '@angular/core';
import { Shortcuts } from '../common/shortcuts';

@Injectable({
  providedIn: 'root'
})
export class KeyboardBindingsService {

  bindings = new Map<Shortcuts, string>();
  keyStrings = new Map<Shortcuts, string>();

  constructor() {
    this.bindings.set(Shortcuts.MainMenu, "window:keydown.alt.shift.m");
    this.keyStrings.set(Shortcuts.MainMenu, "Alt Shift M");
    this.bindings.set(Shortcuts.NewEntry, "window:keydown.alt.shift.n");
    this.keyStrings.set(Shortcuts.NewEntry, "Alt Shift N");
    this.bindings.set(Shortcuts.ShiftToHabitsTab, "window:keydown.alt.shift.h");
    this.keyStrings.set(Shortcuts.ShiftToHabitsTab, "Alt Shift H");
    this.bindings.set(Shortcuts.ShiftToLogsTab, "window:keydown.alt.shift.l");
    this.keyStrings.set(Shortcuts.ShiftToLogsTab, "Alt Shift L");
    this.bindings.set(Shortcuts.ShiftToProjectsTab, "window:keydown.alt.shift.p");
    this.keyStrings.set(Shortcuts.ShiftToProjectsTab, "Alt Shift P");

    // TODO: load shortcuts from preferences #56
  }

  getShortcut (shortcut: Shortcuts): string {
    return this.bindings.get(shortcut) ?? "";
  }

  getKeyString (shortcut: Shortcuts): string {
    return this.keyStrings.get(shortcut) ?? "";
  }
}
