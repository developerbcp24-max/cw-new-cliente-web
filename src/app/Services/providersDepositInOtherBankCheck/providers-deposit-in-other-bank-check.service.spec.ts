import { TestBed, inject } from '@angular/core/testing';

import { ProvidersDepositInOtherBankCheckService } from './providers-deposit-in-other-bank-check.service';

describe('ProvidersDepositInOtherBankCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvidersDepositInOtherBankCheckService]
    });
  });

  it('should be created', inject([ProvidersDepositInOtherBankCheckService], (service: ProvidersDepositInOtherBankCheckService) => {
    expect(service).toBeTruthy();
  }));
});
