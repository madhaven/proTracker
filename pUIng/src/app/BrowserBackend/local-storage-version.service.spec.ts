import { TestBed } from '@angular/core/testing';

import { LocalStorageVersionService } from './local-storage-version.service';

describe('LocalStorageVersionService', () => {
  let service: LocalStorageVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
