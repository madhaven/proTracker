import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRowComponent } from './task-row.component';

describe('TaskRowComponent', () => {
  let component: TaskRowComponent;
  let fixture: ComponentFixture<TaskRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
