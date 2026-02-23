import { TestBed, inject } from '@angular/core/testing';

import { ClaimRequestService } from './claim-request.service';

describe('ClaimRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimRequestService]
    });
  });

  it('should be created', inject([ClaimRequestService], (service: ClaimRequestService) => {
    expect(service).toBeTruthy();
  }));
});
