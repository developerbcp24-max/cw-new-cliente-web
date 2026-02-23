import { TestBed, inject } from '@angular/core/testing';

import { TigoPaymentsService } from './tigo-payments.service';

describe('TigoPaymentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TigoPaymentsService]
    });
  });

  it('should be created', inject([TigoPaymentsService], (service: TigoPaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
