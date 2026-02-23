import { TestBed, inject } from '@angular/core/testing';

import { SoliPaymentsService } from './soli-payments.service';

describe('SoliPaymentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoliPaymentsService]
    });
  });

  it('should be created', inject([SoliPaymentsService], (service: SoliPaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
