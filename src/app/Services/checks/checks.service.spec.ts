import { TestBed, inject } from '@angular/core/testing';

import { ChecksService } from './checks.service';

describe('ChecksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChecksService]
    });
  });

  it('should be created', inject([ChecksService], (service: ChecksService) => {
    expect(service).toBeTruthy();
  }));
});
