import { Component, ChangeDetectionStrategy, output } from '@angular/core';

@Component({
  selector: 'pt-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  close = output<void>();
}
