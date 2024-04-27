import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableItemComponent } from './editable-item.component';

describe('EditableItemComponent', () => {
  let component: EditableItemComponent;
  let fixture: ComponentFixture<EditableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
