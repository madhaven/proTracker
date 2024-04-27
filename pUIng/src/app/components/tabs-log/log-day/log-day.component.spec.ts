import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogDayComponent } from './log-day.component';

describe('LogDayComponent', () => {
  let component: LogDayComponent;
  let fixture: ComponentFixture<LogDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
