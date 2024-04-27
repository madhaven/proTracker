import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsLogComponent } from './tabs-log.component';

describe('TabsLogComponent', () => {
  let component: TabsLogComponent;
  let fixture: ComponentFixture<TabsLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
