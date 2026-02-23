import { TestBed, inject } from '@angular/core/testing';

import { NewBallotOfWarrantyService } from './new-ballot-of-warranty.service';

describe('NewBallotOfWarrantyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewBallotOfWarrantyService]
    });
  });

  it('should be created', inject([NewBallotOfWarrantyService], (service: NewBallotOfWarrantyService) => {
    expect(service).toBeTruthy();
  }));
});
