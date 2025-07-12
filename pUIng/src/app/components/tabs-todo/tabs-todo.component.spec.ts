import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsTodoComponent } from './tabs-todo.component';

describe('TabsTodoComponent', () => {
  let component: TabsTodoComponent;
  let fixture: ComponentFixture<TabsTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsTodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabsTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
