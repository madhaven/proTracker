import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsHabitComponent } from './tabs-habit.component';
import { UiStateService } from '../../services/ui-state.service';
import { NewHabitShortcutService } from '../../services/new-habit-shortcut.service';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Habit } from '../../models/habit.model';
import { HabitMetricsService } from '../../services/habit-metrics.service';

class MockUiStateService {
  shortcutsEnabled = true;
  getHabitsDueOn() { return new Map<number, Habit>(); }
  stateChanged = new Subject<MockUiStateService>();
  stateChanged$ = this.stateChanged.asObservable();
  habits = new Map<number, Habit>();
}
class MockNewHabitShortcutService {
  requestFocus = jasmine.createSpy('requestFocus');
  private newHabitFocusTrigger = new Subject<void>();
  newHabitFocusTriggered$ = this.newHabitFocusTrigger.asObservable();
}

class MockHabitMetricService {
  getActivityStart() { return 1; }
}

describe('TabsHabitComponent', () => {
  let component: TabsHabitComponent;
  let fixture: ComponentFixture<TabsHabitComponent>;
  let mockUiService: MockUiStateService;
  let mockShortcut: MockNewHabitShortcutService;
  let mockHabitMetricService: MockHabitMetricService;

  beforeEach(async () => {
    mockUiService = new MockUiStateService();
    mockShortcut = new MockNewHabitShortcutService();
    mockHabitMetricService = new MockHabitMetricService();
    await TestBed.configureTestingModule({
      imports: [TabsHabitComponent],
      providers: [
        { provide: UiStateService, useValue: mockUiService },
        { provide: NewHabitShortcutService, useValue: mockShortcut },
        { provide: HabitMetricsService, useValue: mockHabitMetricService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TabsHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: newHabitShortcut prevents default and calls requestFocus', () => {
    const event = { preventDefault: jasmine.createSpy() } as any;
    component.uiStateService.shortcutsEnabled = true;
    component.newHabitShortcut(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockShortcut.requestFocus).toHaveBeenCalled();
  });

  it('unit: should update dueHabits on stateChanged$', () => {
    mockUiService.stateChanged.next(mockUiService);
    expect(component.dueHabits).toBeDefined();
  });

  it('dom: should render main container', () => {
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('main'));
    expect(main).toBeTruthy();
  });
});
