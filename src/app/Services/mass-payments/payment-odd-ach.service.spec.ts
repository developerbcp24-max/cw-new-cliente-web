import { TestBed, inject } from '@angular/core/testing';

import { PaymentOddAchService } from './payment-odd-ach.service';

describe('PaymentOddAchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentOddAchService]
    });
  });

  it('should be created', inject([PaymentOddAchService], (service: PaymentOddAchService) => {
    expect(service).toBeTruthy();
  }));
});
