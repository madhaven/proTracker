import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHabitSectionComponent } from './new-habit-section.component';

describe('NewHabitSectionComponent', () => {
  let component: NewHabitSectionComponent;
  let fixture: ComponentFixture<NewHabitSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHabitSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewHabitSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
