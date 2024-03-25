import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsHabitComponent } from './tabs-habit.component';

describe('TabsHabitComponent', () => {
  let component: TabsHabitComponent;
  let fixture: ComponentFixture<TabsHabitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsHabitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabsHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
