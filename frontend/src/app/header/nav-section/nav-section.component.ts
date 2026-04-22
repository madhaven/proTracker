import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '@atoms';
import { AppRouterLinks, ButtonType } from '@constants';

interface NavItem {
  label: string;
  link: string;
}

@Component({
  selector: 'pt-nav-section',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './nav-section.component.html',
  styleUrl: './nav-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavSectionComponent {
  readonly ButtonType = ButtonType;

  readonly navItems: NavItem[] = [
    { label: 'Today', link: AppRouterLinks.Today },
    { label: 'Tasks', link: AppRouterLinks.Tasks },
    { label: 'Goals', link: AppRouterLinks.Goals },
    { label: 'Habits', link: AppRouterLinks.Habits },
    { label: 'Settings', link: AppRouterLinks.Settings },
  ];
}
