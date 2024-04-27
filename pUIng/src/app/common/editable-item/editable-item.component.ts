import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'pui-editable-item',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './editable-item.component.html',
  styleUrl: './editable-item.component.css'
})
export class EditableItemComponent implements AfterViewInit {
  @Input() content!: string;
  @Input() isButtonOnLeft: boolean = false;
  @Output() itemEdited = new EventEmitter<string>();
  @Output() contentClicked = new EventEmitter();
  itemEditable: boolean = false;
  @ViewChild('editableInput') inputItem!: ElementRef;

  tryUpdate(event: Event) {
    var target = event.target as HTMLInputElement;
    var newValue = target.value.trim();

    if (newValue.length < 1 || newValue == this.content) {
      this.itemEditable = false;
      return;
    }
    
    this.itemEdited.emit(newValue);
    this.itemEditable = false;
  }

  ngAfterViewInit() {
  }

  inputChanged(event: Event) {
    var target = event.target as HTMLInputElement;
    target.blur();
  }

  contentClick() {
    this.contentClicked.emit();
  }

  makeItemEditable() {
    this.itemEditable = true;
    setTimeout(() => {
      this.inputItem.nativeElement.value = this.content;
      this.inputItem.nativeElement.select();
    });
  }
}
