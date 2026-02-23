import { TestBed, inject } from '@angular/core/testing';

import { CreditsService } from './credits.service';

describe('CreditsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreditsService]
    });
  });

  it('should be created', inject([CreditsService], (service: CreditsService) => {
    expect(service).toBeTruthy();
  }));
});
