import { TestBed, inject } from '@angular/core/testing';

import { BalancesAndMovementsService } from './balances-and-movements.service';

describe('BalancesAndMovementsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BalancesAndMovementsService]
    });
  });

  it('should be created', inject([BalancesAndMovementsService], (service: BalancesAndMovementsService) => {
    expect(service).toBeTruthy();
  }));
});
