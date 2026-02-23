import { TestBed, inject } from '@angular/core/testing';

import { MultiplePaymentsService } from './multiple-payments-service.service';

describe('MultiplePaymentsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiplePaymentsService]
    });
  });

  it('should be created', inject([MultiplePaymentsService], (service: MultiplePaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
