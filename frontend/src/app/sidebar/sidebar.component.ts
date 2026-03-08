import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StateService, ThemeService } from '@services';
import { ActiveTab, Theme, SvgIcon } from '@constants';
import { SvgComponent } from '@atoms';

@Component({
  selector: 'pt-sidebar',
  standalone: true,
  imports: [SvgComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private stateService = inject(StateService);
  private themeService = inject(ThemeService);

  activeTab = this.stateService.activeTab;
  currentTheme = this.themeService.theme;

  ActiveTab = ActiveTab;
  Theme = Theme;
  SvgIcon = SvgIcon;

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  setActiveTab(tab: ActiveTab) {
    this.activeTab.set(tab);
  }

  setDashboardTab() {
    this.setActiveTab(ActiveTab.Dashboard);
  }

  setTasksTab() {
    this.setActiveTab(ActiveTab.Tasks);
  }

  setGoalsTab() {
    this.setActiveTab(ActiveTab.Goals);
  }

  setHabitsTab() {
    this.setActiveTab(ActiveTab.Habits);
  }
}
