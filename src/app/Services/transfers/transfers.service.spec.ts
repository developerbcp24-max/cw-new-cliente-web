import { TestBed, inject } from '@angular/core/testing';

import { TransfersService } from './transfers.service';

describe('TransfersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransfersService]
    });
  });

  it('should be created', inject([TransfersService], (service: TransfersService) => {
    expect(service).toBeTruthy();
  }));
});
