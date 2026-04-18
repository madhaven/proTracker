import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ButtonType } from '@constants';

@Component({
  selector: 'pt-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  readonly type = input<ButtonType | string>(ButtonType.Primary);
  readonly disabled = input<boolean>(false);
  
  ButtonType = ButtonType;
}
