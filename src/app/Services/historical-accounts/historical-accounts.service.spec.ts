import { TestBed, inject } from '@angular/core/testing';

import { HistoricalAccountsService } from './historical-accounts.service';

describe('HistoricalAccountsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoricalAccountsService]
    });
  });

  it('should be created', inject([HistoricalAccountsService], (service: HistoricalAccountsService) => {
    expect(service).toBeTruthy();
  }));
});
