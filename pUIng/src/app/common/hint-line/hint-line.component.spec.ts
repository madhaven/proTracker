import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintLineComponent } from './hint-line.component';

describe('HintLineComponent', () => {
  let component: HintLineComponent;
  let fixture: ComponentFixture<HintLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HintLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HintLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
