import { TestBed, inject } from '@angular/core/testing';

import { FavoritePaymentsConfigService } from './favorite-payments-config.service';

describe('FavoritePaymentsConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavoritePaymentsConfigService]
    });
  });

  it('should be created', inject([FavoritePaymentsConfigService], (service: FavoritePaymentsConfigService) => {
    expect(service).toBeTruthy();
  }));
});
