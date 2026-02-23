import { TestBed } from '@angular/core/testing';

import { NewOptTokenVuService } from './new-opt-token-vu.service';

describe('NewOptTokenVuService', () => {
  let service: NewOptTokenVuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewOptTokenVuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
