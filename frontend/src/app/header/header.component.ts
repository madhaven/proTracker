import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '@services';
import { SvgComponent, ButtonComponent } from '@atoms';
import { NavSectionComponent } from './nav-section/nav-section.component';
import { RouterLink } from '@angular/router';
import { AppRouterLinks, ButtonType, SvgIcon, Theme } from '@constants';

@Component({
  selector: 'pt-header',
  standalone: true,
  imports: [SvgComponent, NavSectionComponent, RouterLink, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);

  readonly currentTheme = this.themeService.theme;

  readonly Theme = Theme;
  readonly SvgIcon = SvgIcon;
  readonly ButtonType = ButtonType;
  readonly AppRouterLinks = AppRouterLinks;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}