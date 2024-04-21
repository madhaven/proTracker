import { NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'pui-editable-item',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './editable-item.component.html',
  styleUrl: './editable-item.component.css'
})
export class EditableItemComponent {
  @Input() content!: string
  @Input() isButtonOnLeft: boolean = false
  @Output() itemEdited = new EventEmitter<string>()
  @Output() contentClicked = new EventEmitter()
  isItemEditable: boolean = false
  @ViewChild('editableInput') inputItem!: ElementRef;

  tryUpdate(event: Event) {
    var target = event.target as HTMLInputElement
    var newValue = target.value.trim()
    
    this.itemEdited.emit(newValue)

    this.isItemEditable = false
  }

  ngAfterViewInit() {
  }

  inputChanged(event: Event) {
    var target = event.target as HTMLInputElement
    target.blur()
  }

  contentClick() {
    this.contentClicked.emit()
  }

  makeItemEditable() {
    this.isItemEditable = true
    setTimeout(() => {
      this.inputItem.nativeElement.value = this.content
      this.inputItem.nativeElement.select()
    });
  }
}
