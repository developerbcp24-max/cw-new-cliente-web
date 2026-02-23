import { TestBed, inject } from '@angular/core/testing';

import { VouchersByOperationService } from './vouchers-by-operation.service';

describe('VouchersByOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VouchersByOperationService]
    });
  });

  it('should be created', inject([VouchersByOperationService], (service: VouchersByOperationService) => {
    expect(service).toBeTruthy();
  }));
});
