import { TestBed, inject } from '@angular/core/testing';

import { TransfersAbroadService } from './transfer-abroad.service';

describe('TransferAbroadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransfersAbroadService]
    });
  });

  it('should be created', inject([TransfersAbroadService], (service: TransfersAbroadService) => {
    expect(service).toBeTruthy();
  }));
});
