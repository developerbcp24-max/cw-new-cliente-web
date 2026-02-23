import { TestBed } from '@angular/core/testing';

import { InactivitySessionService } from './inactivity-session.service';

describe('InactivitySessionService', () => {
  let service: InactivitySessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InactivitySessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
