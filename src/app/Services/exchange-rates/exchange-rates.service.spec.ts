import { TestBed, inject } from '@angular/core/testing';

import { ExchangeRatesService } from './exchange-rates.service';

describe('ExchangeRatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExchangeRatesService]
    });
  });

  it('should be created', inject([ExchangeRatesService], (service: ExchangeRatesService) => {
    expect(service).toBeTruthy();
  }));
});
