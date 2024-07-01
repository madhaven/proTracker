import { TestBed } from '@angular/core/testing';

import { HintingService } from './hinting.service';

describe('HintingService', () => {
  let service: HintingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HintingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
