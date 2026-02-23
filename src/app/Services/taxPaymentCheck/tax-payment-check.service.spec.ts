import { TestBed, inject } from '@angular/core/testing';

import { TaxPaymentCheckService } from './tax-payment-check.service';

describe('TaxPaymentCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaxPaymentCheckService]
    });
  });

  it('should be created', inject([TaxPaymentCheckService], (service: TaxPaymentCheckService) => {
    expect(service).toBeTruthy();
  }));
});
