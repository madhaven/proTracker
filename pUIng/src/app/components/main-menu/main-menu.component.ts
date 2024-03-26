import { Component, input } from '@angular/core';

@Component({
  selector: 'pui-main-menu',
  standalone: true,
  imports: [],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {

  menuVisible: boolean;
  uiState = input({menuVisible: false})

  constructor() {
    this.menuVisible = true; // TODO: ng get state variables
  }

  // handles the open and close of the sidebar
  toggleMenuBar(visible:boolean|null = null) {
    this.menuVisible = visible == null
      ? !this.menuVisible
      : visible
  }
}
