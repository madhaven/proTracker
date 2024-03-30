import { Component } from '@angular/core';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'pui-tabs-log',
  standalone: true,
  imports: [],
  templateUrl: './tabs-log.component.html',
  styleUrl: './tabs-log.component.css'
})
export class TabsLogComponent {

  uiStateService:UiStateService

  constructor(uiStateService: UiStateService) {
    this.uiStateService = uiStateService
  }
}
