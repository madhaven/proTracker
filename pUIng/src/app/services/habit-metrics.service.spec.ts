import { TestBed } from '@angular/core/testing';

import { HabitMetricsService } from './habit-metrics.service';

describe('HabitMetricsService', () => {
  let service: HabitMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
