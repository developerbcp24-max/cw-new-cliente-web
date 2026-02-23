import { TestBed, inject } from '@angular/core/testing';

import { CashPaymentsService } from './cash-payments.service';

describe('CashPaymentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashPaymentsService]
    });
  });

  it('should be created', inject([CashPaymentsService], (service: CashPaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
