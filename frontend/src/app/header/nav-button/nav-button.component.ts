import { Component, input, output, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@services';
import { ActiveTab } from '@constants';

@Component({
  selector: 'pt-nav-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavButtonComponent {
  private stateService = inject(StateService);
  
  label = input.required<string>();
  tab = input.required<ActiveTab>();
  clicked = output<void>();

  isActive = computed(() => this.stateService.activeTab() === this.tab());

  onClick() {
    this.clicked.emit();
  }
}
