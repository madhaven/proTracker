import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLogSectionComponent } from './new-log-section.component';

describe('NewLogSectionComponent', () => {
  let component: NewLogSectionComponent;
  let fixture: ComponentFixture<NewLogSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLogSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewLogSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
