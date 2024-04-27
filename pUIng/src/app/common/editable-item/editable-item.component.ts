import { NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
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
  newContent: string = ''

  tryUpdate() {
    var newValue = this.newContent.trim();
    
    if (newValue.length < 1 || newValue == this.content) {
      this.itemEditable = false;
      this.newContent = this.content
      return;
    }
    
    this.itemEdited.emit(newValue);
    this.itemEditable = false;
  }

  ngAfterViewInit() {
  }

  inputChanged(target: HTMLInputElement) {
    target.blur();
  }

  contentClick() {
    this.contentClicked.emit();
  }

  makeItemEditable(target: HTMLInputElement) {
    this.itemEditable = true;
    setTimeout(() => {
      this.newContent = this.content;
      target.select();
    });
  }
}
