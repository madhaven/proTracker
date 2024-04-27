import { TestBed } from '@angular/core/testing';

import { ElectronComService } from './electron-com.service';

describe('ElectronService', () => {
  let service: ElectronComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
