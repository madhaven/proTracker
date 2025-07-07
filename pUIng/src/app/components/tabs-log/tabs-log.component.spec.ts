import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsLogComponent } from './tabs-log.component';
import { UiStateService } from '../../services/ui-state.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TaskLog } from '../../models/task-log.model';
import { Task } from '../../models/task.model';

class MockUiStateService {
  shortcutsEnabled = true;
  getLogTreeAsOrderredList() { return [["test", new Map([[ 1, new Map([[ 1, new TaskLog(1, 1, 1, 1) ]]) ]]) ]]; }
  getHabitsDueOn() { return new Map(); }
  getProjectTree() { return new Map(); }
  getProject() { return { name: 'Project' }; }
  logsExist() { return true; }
  getTask(taskId: number) { return new Task(1, 1, undefined, 'poda'); }
  stateChanged$ = { subscribe: () => ({}) };
}
class MockRouter {
  navigateCalls: any[] = [];
  navigate(args: any) { this.navigateCalls.push(args); }
}

describe('TabsLogComponent', () => {
  let component: TabsLogComponent;
  let fixture: ComponentFixture<TabsLogComponent>;
  let mockService: MockUiStateService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockService = new MockUiStateService();
    mockRouter = new MockRouter();
    await TestBed.configureTestingModule({
      imports: [TabsLogComponent],
      providers: [
        { provide: UiStateService, useValue: mockService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TabsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: ngOnInit flashes and scrolls if task is set', () => {
    component.task = 1;
    spyOn(component, 'flashTask');
    spyOn(component, 'scrollTaskIntoView');
    component.ngOnInit();
    expect(component.flashTask).toHaveBeenCalledWith(1);
    expect(component.scrollTaskIntoView).toHaveBeenCalledWith(1);
  });

  it('unit: newLogShortcut prevents default if enabled', () => {
    const event = { preventDefault: jasmine.createSpy() } as any;
    spyOn(component['newLogShortcutService'], 'requestFocus');
    component.uiStateService.shortcutsEnabled = true;
    component.newLogShortcut(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component['newLogShortcutService'].requestFocus).toHaveBeenCalled();
  });

  it('dom: should render main container', () => {
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('main'));
    expect(main).toBeTruthy();
  });
});
