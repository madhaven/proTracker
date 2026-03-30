import { Component, input, output, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { StateService } from '@services';
import { ActiveTab } from '@constants';

@Component({
  selector: 'pt-nav-button',
  standalone: true,
  templateUrl: './nav-button.component.html',
  styleUrl: './nav-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonComponent {
  private readonly stateService = inject(StateService);

  readonly label = input.required<string>();
  readonly tab = input.required<ActiveTab>();
  readonly clicked = output<void>();

  readonly isActive = computed(() => this.stateService.activeTab() === this.tab());

  onClick(): void {
    this.clicked.emit();
  }
}
