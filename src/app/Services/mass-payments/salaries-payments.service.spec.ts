import { TestBed, inject } from '@angular/core/testing';

import { SalariesPaymentsService } from './salaries-payments.service';

describe('SalariesPaymentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalariesPaymentsService]
    });
  });

  it('should be created', inject([SalariesPaymentsService], (service: SalariesPaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
