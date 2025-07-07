import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitItemComponent } from './habit-item.component';
import { Habit } from '../../../models/habit.model';

describe('HabitItemComponent', () => {
  let component: HabitItemComponent;
  let fixture: ComponentFixture<HabitItemComponent>;
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
      imports: [HabitItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitItemComponent);
    component = fixture.componentInstance;
    component.habit = mockHabit;
    component.habitId = mockHabit.id;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
