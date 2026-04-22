import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pt-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {}