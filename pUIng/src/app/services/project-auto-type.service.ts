import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ProjectAutoTypeService {

  private requestedProjectName = new Subject<string>();
  autoTypeRequested$ = this.requestedProjectName.asObservable();

  requestAutoType(projectName: string) {
    this.requestedProjectName.next(projectName);
  }
}
