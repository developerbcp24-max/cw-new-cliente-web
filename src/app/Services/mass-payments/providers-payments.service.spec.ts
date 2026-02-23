import { TestBed, inject } from '@angular/core/testing';

import { ProvidersPaymentsService } from './providers-payments.service';

describe('ProvidersPaymentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvidersPaymentsService]
    });
  });

  it('should be created', inject([ProvidersPaymentsService], (service: ProvidersPaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
