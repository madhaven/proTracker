import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueHabitItemComponent } from './due-habit-item.component';
import { Habit } from '../../../models/habit.model';

describe('DueHabitItemComponent', () => {
  let component: DueHabitItemComponent;
  let fixture: ComponentFixture<DueHabitItemComponent>;
  const mockHabit: Habit = {
    id: 1,
    name: 'Exercise',
    removed: false,
    startTime: 0,
    endTime: 10,
    days: 1,
    lastLogTime: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueHabitItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DueHabitItemComponent);
    component = fixture.componentInstance;
    component.habit = mockHabit;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
