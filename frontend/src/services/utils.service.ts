import { ApplicationRef, Injectable } from "@angular/core";
import { Task } from "@models";

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
      uiOperation(); // for old browsers
    }
  }

  arrangeToPriority(tasks: Task[], lowPriorityFirst: boolean = false): Task[] {
    if (lowPriorityFirst) { return tasks.sort((a, b) => b.priority - a.priority); }
    else { return tasks.sort((a, b) => a.priority - b.priority) }
  }
}