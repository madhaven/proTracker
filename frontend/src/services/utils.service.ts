import { ApplicationRef, Injectable, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Task } from "@models";

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private readonly platformId = inject(PLATFORM_ID);

  getTodayStart(): number {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  transition(appRef: ApplicationRef, uiOperation: () => void): void {
    if (isPlatformBrowser(this.platformId) && (document as any).startViewTransition) {
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