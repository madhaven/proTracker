import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditableItemComponent } from './editable-item.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('EditableItemComponent', () => {
  let component: EditableItemComponent;
  let fixture: ComponentFixture<EditableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableItemComponent, FormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(EditableItemComponent);
    component = fixture.componentInstance;
    component.content = 'test content';
    component.newContent = 'test content';
    fixture.detectChanges();
  });

  it('unit: should create', () => {
    expect(component).toBeTruthy();
  });

  it('unit: tryUpdate emits only if changed and not empty', () => {
    spyOn(component.itemEdited, 'emit');
    component.newContent = 'new value';
    component.tryUpdate();
    expect(component.itemEdited.emit).toHaveBeenCalledWith('new value');
    expect(component.itemEditable).toBeFalse();
  });

  it('unit: tryUpdate does not emit if unchanged or empty', () => {
    spyOn(component.itemEdited, 'emit');
    component.newContent = 'test content';
    component.tryUpdate();
    expect(component.itemEdited.emit).not.toHaveBeenCalled();
    component.newContent = '';
    component.tryUpdate();
    expect(component.itemEditable).toBeFalse();
  });

  it('unit: contentClick emits contentClicked', () => {
    spyOn(component.contentClicked, 'emit');
    component.contentClick();
    expect(component.contentClicked.emit).toHaveBeenCalled();
  });

  it('unit: makeItemEditable sets editable and selects', (done) => {
    const input = document.createElement('input');
    component.content = 'abc';
    component.makeItemEditable(input);
    setTimeout(() => {
      expect(component.itemEditable).toBeTrue();
      expect(component.newContent).toBe('abc');
      done();
    }, 10);
  });

  it('dom: should render content and edit button', () => {
    fixture.detectChanges();
    const contentDiv = fixture.debugElement.query(By.css('.editable_item_content'));
    expect(contentDiv.nativeElement.textContent).toContain('test content');
    const editButtons = fixture.debugElement.queryAll(By.css('.editable_item_edit_button'));
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('dom: should enter edit mode and update content', () => {
    fixture.detectChanges();
    const editButton = fixture.debugElement.query(By.css('.editable_item_edit_button'));
    editButton.nativeElement.click();
    fixture.detectChanges();
    component.newContent = 'changed';
    spyOn(component.itemEdited, 'emit');
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('blur', {});
    fixture.detectChanges();
    expect(component.itemEdited.emit).toHaveBeenCalledWith('changed');
  });
});
