import { TestBed, inject } from '@angular/core/testing';

import { MovementsDepositsService } from './movements-deposits.service';

describe('MovementsDepositsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovementsDepositsService]
    });
  });

  it('should be created', inject([MovementsDepositsService], (service: MovementsDepositsService) => {
    expect(service).toBeTruthy();
  }));
});
