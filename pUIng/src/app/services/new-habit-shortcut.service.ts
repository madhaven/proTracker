import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewHabitShortcutService {

  private newHabitFocusTrigger = new Subject<void>();
  newHabitFocusTriggered$ = this.newHabitFocusTrigger.asObservable();

  requestFocus() {
    this.newHabitFocusTrigger.next();
  }
}
