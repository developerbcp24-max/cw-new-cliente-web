import { TestBed, inject } from '@angular/core/testing';

import { VouchersByBatchService } from './vouchers-by-batch.service';

describe('VouchersByBatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VouchersByBatchService]
    });
  });

  it('should be created', inject([VouchersByBatchService], (service: VouchersByBatchService) => {
    expect(service).toBeTruthy();
  }));
});
