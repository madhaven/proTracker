import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewLogShortcutService {

  private newLogFocusTrigger = new Subject<void>();
  newLogFocusTriggered$ = this.newLogFocusTrigger.asObservable();

  requestFocus() {
    this.newLogFocusTrigger.next();
  }
}
