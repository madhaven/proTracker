import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitGraphComponent } from './habit-graph.component';

describe('HabitGraphComponent', () => {
  let component: HabitGraphComponent;
  let fixture: ComponentFixture<HabitGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
