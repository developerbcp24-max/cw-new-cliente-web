import { TestBed } from '@angular/core/testing';

import { QrPaymentAchService } from './qr-payment-ach.service';

describe('QrPaymentAchService', () => {
  let service: QrPaymentAchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrPaymentAchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
