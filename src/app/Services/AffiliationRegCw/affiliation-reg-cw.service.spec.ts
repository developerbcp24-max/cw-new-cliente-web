import { TestBed } from '@angular/core/testing';

import { AffiliationRegCwService } from './affiliation-reg-cw.service';

describe('AffiliationRegCwService', () => {
  let service: AffiliationRegCwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffiliationRegCwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
