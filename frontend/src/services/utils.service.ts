import { ApplicationRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  getTodayStart(): number {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  transition(appRef: ApplicationRef, uiOperation: () => void): void {
    if (typeof document !== 'undefined' && (document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        uiOperation();
        appRef.tick();
      });
    } else {
      // for old browsers
      uiOperation();
    }
  }
}