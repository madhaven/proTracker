import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsProjectComponent } from './tabs-project.component';

describe('TabsProjectComponent', () => {
  let component: TabsProjectComponent;
  let fixture: ComponentFixture<TabsProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabsProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
