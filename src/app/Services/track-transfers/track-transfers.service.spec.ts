import { TestBed, inject } from '@angular/core/testing';

import { TrackTransfersService } from './track-transfers.service';

describe('TrackTransfersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackTransfersService]
    });
  });

  it('should be created', inject([TrackTransfersService], (service: TrackTransfersService) => {
    expect(service).toBeTruthy();
  }));
});
