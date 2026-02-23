import { TestBed, inject } from '@angular/core/testing';

import { CashPaymentsInLineService } from './cash-payments-in-line.service';

describe('CashPaymentsInLineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashPaymentsInLineService]
    });
  });

  it('should be created', inject([CashPaymentsInLineService], (service: CashPaymentsInLineService) => {
    expect(service).toBeTruthy();
  }));
});
