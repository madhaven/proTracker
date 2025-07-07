import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { HintLineComponent } from './hint-line.component';
import { HintingService } from '../../services/hinting.service';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';

class MockHintingService {
  hint = new Subject<string>();
  hintRequested$ = this.hint.asObservable();
  hider = new Subject<void>();
  hideHintRequested$ = this.hider.asObservable();
  showHint(hint: string) { this.hint.next(hint); }
  hideHint() { this.hider.next(); }
}

describe('HintLineComponent', () => {
  let component: HintLineComponent;
  let fixture: ComponentFixture<HintLineComponent>;
  let mockService: MockHintingService;

  beforeEach(async () => {
    mockService = new MockHintingService();
    await TestBed.configureTestingModule({
      imports: [HintLineComponent],
      providers: [{ provide: HintingService, useValue: mockService }]
    }).compileComponents();
    fixture = TestBed.createComponent(HintLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: showHint sets hint and timers', fakeAsync(() => {
    component.showHint('test hint');
    expect(component.hint).toBe('test hint');
    tick(100);
    expect(component.isVisible).toBeTrue();
    tick(1900); // 2000 total
    expect(component.isVisible).toBeFalse();
    tick(2000); // 4000 total
    expect(component.hint).toBe('');
  }));

  it('unit: hideHint clears timers and hides', fakeAsync(() => {
    component.showHint('test');
    tick(100);
    component.hideHint();
    expect(component.isVisible).toBeFalse();
    tick(2000);
    expect(component.hint).toBe('');
  }));

  it('unit: should subscribe to hintRequested$ and call showHint', fakeAsync(() => {
    spyOn(component, 'showHint').and.callThrough();
    mockService.showHint('service hint');
    tick(100);
    expect(component.showHint).toHaveBeenCalledWith('service hint');
    expect(component.isVisible).toBeTrue();
    flush();
  }));

  it('unit: should subscribe to hideHintRequested$ and call hideHint', fakeAsync(() => {
    spyOn(component, 'hideHint').and.callThrough();
    mockService.hideHint();
    expect(component.hideHint).toHaveBeenCalled();
    flush();
  }));

  it('dom: should render hint when visible', fakeAsync(() => {
    component.showHint('visible hint');
    tick(110);
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    expect(div.nativeElement.textContent).toContain('visible hint');
    expect(div.nativeElement.classList).not.toContain('hidden');
    tick(1910);
    fixture.detectChanges();
    expect(div.nativeElement.classList).toContain('hidden');
    flush();
  }));

  it('dom: should render empty when hint is cleared', fakeAsync(() => {
    component.showHint('clear me');
    tick(4000);
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    expect(div.nativeElement.textContent).toBe('');
  }));
});
