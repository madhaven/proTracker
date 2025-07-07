import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHabitSectionComponent } from './new-habit-section.component';
import { NewHabitShortcutService } from '../../../services/new-habit-shortcut.service';

describe('NewHabitSectionComponent', () => {
  let component: NewHabitSectionComponent;
  let fixture: ComponentFixture<NewHabitSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHabitSectionComponent],
      providers: [NewHabitShortcutService]
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
