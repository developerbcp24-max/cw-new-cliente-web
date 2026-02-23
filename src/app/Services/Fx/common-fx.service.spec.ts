import { TestBed } from '@angular/core/testing';

import { CommonFxService } from './common-fx.service';

describe('CommonFxService', () => {
  let service: CommonFxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonFxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
