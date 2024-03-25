import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsHabitComponent } from './../components/tabs-habit/tabs-habit.component';
import { TabsLogComponent } from './../components/tabs-log/tabs-log.component';
import { MainMenuComponent } from './../components/main-menu/main-menu.component';
import { TabsProjectComponent } from './../components/tabs-project/tabs-project.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TabsLogComponent,
    TabsHabitComponent,
    MainMenuComponent,
    TabsProjectComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pUIng';
}
