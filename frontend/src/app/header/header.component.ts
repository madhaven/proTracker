import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '@services';
import { Theme, SvgIcon } from '@constants';
import { SvgComponent } from '@atoms';
import { RouterLink } from '@angular/router';
import { NavSectionComponent } from './nav-section/nav-section.component';

@Component({
  selector: 'pt-header',
  standalone: true,
  imports: [SvgComponent, NavSectionComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);

  readonly currentTheme = this.themeService.theme;

  readonly Theme = Theme;
  readonly SvgIcon = SvgIcon;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}