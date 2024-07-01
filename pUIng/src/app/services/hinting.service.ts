import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HintingService {

  private hint = new Subject<string>();
  hintRequested$ = this.hint.asObservable();

  showHint(hint: string) {
    this.hint.next(hint);
  }
}
