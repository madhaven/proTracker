import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueHabitItemComponent } from './due-habit-item.component';

describe('DueHabitItemComponent', () => {
  let component: DueHabitItemComponent;
  let fixture: ComponentFixture<DueHabitItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueHabitItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DueHabitItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
