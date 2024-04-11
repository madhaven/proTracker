import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
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
  isItemEditable: boolean = false
  isButtonOnLeft: boolean = false
  @ViewChild('editableInput') inputItem!: ElementRef;

  tryUpdate(event: Event): void {
    var target = event.target as HTMLInputElement
    var newValue = target.value.trim()
    
    // TODO contact service
    console.log("Contact service")

    this.uiUpdater()
  }

  ngAfterViewInit() {
  }

  inputChanged(event: Event): void {
    var target = event.target as HTMLInputElement
    target.blur()
  }

  uiUpdater(): void {
    this.isItemEditable = false
  }

  makeItemEditable(): void {
    this.isItemEditable = true
    console.log(this.inputItem.nativeElement)
    setTimeout(() => {
      this.inputItem.nativeElement.value = this.content
      this.inputItem.nativeElement.select()
    });
  }
}
