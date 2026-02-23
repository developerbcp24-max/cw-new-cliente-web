import { TestBed } from '@angular/core/testing';

import { RegBoQrService } from './reg-bo-qr.service';

describe('RegBoQrService', () => {
  let service: RegBoQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegBoQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
