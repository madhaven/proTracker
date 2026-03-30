import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { StateService } from '@services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MainContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly stateService = inject(StateService);
  readonly activeTab = this.stateService.activeTab;
}
