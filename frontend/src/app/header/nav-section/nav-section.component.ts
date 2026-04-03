import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRouterLinks } from '@constants';

@Component({
  selector: 'pt-nav-section',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-section.component.html',
  styleUrl: './nav-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavSectionComponent {
  readonly AppRouterLinks = AppRouterLinks;
}
