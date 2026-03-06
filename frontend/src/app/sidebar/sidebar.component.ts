import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavButtonComponent } from './nav-button/nav-button.component';
import { StateService } from '../../services';
import { ActiveTab } from '../../constants';

@Component({
  selector: 'pt-sidebar',
  standalone: true,
  imports: [NavButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private stateService = inject(StateService);
  activeTab = this.stateService.activeTab;
  ActiveTab = ActiveTab;

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
