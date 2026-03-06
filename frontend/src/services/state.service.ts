import { Injectable, signal } from '@angular/core';
import { ActiveTab } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  activeTab = signal<ActiveTab>(ActiveTab.Dashboard);

  setActiveTab(tab: ActiveTab) {
    this.activeTab.set(tab);
  }
}
