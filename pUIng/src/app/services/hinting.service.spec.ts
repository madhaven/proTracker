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

  it('unit: showHint should emit value', (done) => {
    service.hintRequested$.subscribe(val => {
      expect(val).toBe('test');
      done();
    });
    service.showHint('test');
  });

  it('unit: hideHint should emit', (done) => {
    service.hideHintRequested$.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });
    service.hideHint();
  });
});
