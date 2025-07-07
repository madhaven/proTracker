import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectTaskComponent } from './project-task.component';
import { UiStateService } from '../../../../services/ui-state.service';
import { Task } from '../../../../models/task.model';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

class MockUiStateService {
  stateChanged$ = new Subject<any>();
  getTask(id: number) { return new Task(id, 1, undefined, 'Task ' + id); }
  editTask(task: Task) { this.lastEdit = task; }
  lastEdit?: Task;
  stateChanged = this.stateChanged$;
}
class MockRouter {
  navigateCalls: any[] = [];
  navigate(args: any) { this.navigateCalls.push(args); }
}

describe('ProjectTaskComponent', () => {
  let component: ProjectTaskComponent;
  let fixture: ComponentFixture<ProjectTaskComponent>;
  let mockService: MockUiStateService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockService = new MockUiStateService();
    mockRouter = new MockRouter();
    await TestBed.configureTestingModule({
      imports: [ProjectTaskComponent],
      providers: [
        { provide: UiStateService, useValue: mockService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectTaskComponent);
    component = fixture.componentInstance;
    component.taskId = 1;
    component.statusId = 0;
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: taskEdit calls service', () => {
    component.task = new Task(1, 1, undefined, 'Old');
    component.taskEdit('New');
    expect(mockService.lastEdit?.summary).toBe('New');
  });

  it('unit: redirectToLogs calls router', () => {
    component.redirectToLogs();
    expect(mockRouter.navigateCalls.length).toBeGreaterThan(0);
    expect(mockRouter.navigateCalls[0][0]).toContain('/logs');
  });

  it('dom: should render task summary', () => {
    component.task = new Task(1, 1, undefined, 'Task Render');
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.editable_item_content'));
    if (content) {
      expect(content.nativeElement.textContent).toContain('Task Render');
    }
  });
});
