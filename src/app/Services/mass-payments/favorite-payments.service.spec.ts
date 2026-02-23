import { TestBed, inject } from '@angular/core/testing';

import { FavoritePaymentsService } from './favorite-payments.service';

describe('FavoritePaymentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavoritePaymentsService]
    });
  });

  it('should be created', inject([FavoritePaymentsService], (service: FavoritePaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
