import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { MainMenuComponent } from './main-menu.component';
import { UiStateService } from '../../services/ui-state.service';
import { KeyboardBindingsService } from '../../services/keyboard-bindings.service';
import { HintingService } from '../../services/hinting.service';
import { ChangeDetectorRef, Renderer2 } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

class MockUiStateService {
  idleTolerance = 60;
  loading$ = new Subject<number>();
  get idleTime() { return 0; }
  set idleTime(val: number) {}
}
class MockKeyboardBindingsService {}
class MockHintingService {}
class MockChangeDetectorRef { markForCheck() {} }
class MockRenderer2 { listen() { return () => {}; } }

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  let mockUiState: MockUiStateService;

  beforeEach(async () => {
    mockUiState = new MockUiStateService();
    await TestBed.configureTestingModule({
      imports: [MainMenuComponent],
      providers: [
        { provide: UiStateService, useValue: mockUiState },
        { provide: KeyboardBindingsService, useClass: MockKeyboardBindingsService },
        { provide: HintingService, useClass: MockHintingService },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
        { provide: Renderer2, useClass: MockRenderer2 },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: should set appLoadPercent on loading$', () => {
    mockUiState.loading$.next(50);
    expect(component.appLoadPercent).toBe(50);
  });

  it('dom: should render menu side_handle', () => {
    component.toggleMenuBar(true);
    fixture.detectChanges();
    const menu = fixture.debugElement.query(By.css('#side_handle'));
    expect(menu).toBeTruthy();    
  });
});
