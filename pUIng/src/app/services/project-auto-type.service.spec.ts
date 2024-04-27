import { TestBed } from '@angular/core/testing';

import { ProjectAutoTypeService } from './project-auto-type.service';

describe('ProjectAutoTypeService', () => {
  let service: ProjectAutoTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectAutoTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
