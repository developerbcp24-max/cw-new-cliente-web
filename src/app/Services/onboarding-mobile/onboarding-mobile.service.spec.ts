import { TestBed } from '@angular/core/testing';

import { OnboardingMobileService } from './onboarding-mobile.service';

describe('OnboardingMobileService', () => {
  let service: OnboardingMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
