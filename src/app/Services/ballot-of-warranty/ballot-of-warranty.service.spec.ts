import { TestBed, inject } from '@angular/core/testing';

import { BallotOfWarrantyService } from './ballot-of-warranty.service';

describe('BallotOfWarrantyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BallotOfWarrantyService]
    });
  });

  it('should be created', inject([BallotOfWarrantyService], (service: BallotOfWarrantyService) => {
    expect(service).toBeTruthy();
  }));
});
