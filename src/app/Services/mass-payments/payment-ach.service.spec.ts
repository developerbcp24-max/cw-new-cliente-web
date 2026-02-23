import { TestBed, inject } from '@angular/core/testing';

import { PaymentAchService } from './payment-ach.service';

describe('PaymentAchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentAchService]
    });
  });

  it('should be created', inject([PaymentAchService], (service: PaymentAchService) => {
    expect(service).toBeTruthy();
  }));
});
