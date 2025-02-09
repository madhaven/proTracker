import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HintingService {
  // delegates hint show/hide requests to the hinting component

  private hint = new Subject<string>();
  hintRequested$ = this.hint.asObservable();
  private hider = new Subject<void>();
  hideHintRequested$ = this.hider.asObservable();

  showHint(hint: string) {
    this.hint.next(hint);
  }

  hideHint() {
    this.hider.next();
  }
}
