import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Theme } from '@constants';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.applyTheme(theme);
    });
  }

  toggleTheme() {
    this.theme.update(t => t === Theme.Light ? Theme.Dark : Theme.Light);
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
  }

  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return Theme.Light;
    }

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (Object.values(Theme).includes(savedTheme)) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light;
  }

  private applyTheme(theme: Theme) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === Theme.Dark) {
      root.classList.add('dark');
      root.classList.remove('light')
    } else if (theme === Theme.Light) {
      root.classList.remove('dark');
      root.classList.add('light')
    }
  }
}
