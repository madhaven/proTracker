import { Component, ChangeDetectionStrategy, inject, ApplicationRef } from '@angular/core';
import { StateService, ThemeService, UtilService } from '@services';
import { ActiveTab, Theme, SvgIcon } from '@constants';
import { SvgComponent } from '@atoms';
import { NavButtonComponent } from './nav-button/nav-button.component';

@Component({
  selector: 'pt-header',
  standalone: true,
  imports: [SvgComponent, NavButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly stateService = inject(StateService);
  private readonly themeService = inject(ThemeService);
  private readonly appRef = inject(ApplicationRef);
  private readonly utils = inject(UtilService);

  readonly activeTab = this.stateService.activeTab;
  readonly currentTheme = this.themeService.theme;

  readonly ActiveTab = ActiveTab;
  readonly Theme = Theme;
  readonly SvgIcon = SvgIcon;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setActiveTab(tab: ActiveTab): void {
    this.utils.transition(this.appRef, () => {
      this.stateService.setActiveTab(tab);
    });
  }

  setDashboardTab(): void {
    this.setActiveTab(ActiveTab.Dashboard);
  }

  setTasksTab(): void {
    this.setActiveTab(ActiveTab.Tasks);
  }

  setGoalsTab(): void {
    this.setActiveTab(ActiveTab.Goals);
  }

  setHabitsTab(): void {
    this.setActiveTab(ActiveTab.Habits);
  }
}
