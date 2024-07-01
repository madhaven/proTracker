import { TestBed } from '@angular/core/testing';

import { KeyboardBindingsService } from './keyboard-bindings.service';

describe('KeyboardBindingsService', () => {
  let service: KeyboardBindingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardBindingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
