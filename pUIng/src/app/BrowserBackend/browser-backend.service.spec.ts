import { TestBed } from '@angular/core/testing';

import { BrowserBackendService } from './browser-backend.service';

describe('BrowserBackendService', () => {
  let service: BrowserBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
