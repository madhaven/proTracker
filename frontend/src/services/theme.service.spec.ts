import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { PLATFORM_ID } from '@angular/core';
import { Theme } from '../constants';

describe('ThemeService', () => {
  let service: ThemeService;

  describe('Server Platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      service = TestBed.inject(ThemeService);
    });

    it('should be created on server without ReferenceError', () => {
      expect(service).toBeTruthy();
    });

    it('should return Light theme on server', () => {
      expect(service.currentTheme()).toBe(Theme.Light);
    });
  });

  describe('Browser Platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });
      // Mock localStorage and window.matchMedia if needed
      // For now, just test creation
      service = TestBed.inject(ThemeService);
    });

    it('should be created on browser', () => {
      expect(service).toBeTruthy();
    });
  });
});
