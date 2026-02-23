import { TestBed, inject } from '@angular/core/testing';

import { VoucherOperationService } from './voucher-operation.service';

describe('VoucherOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoucherOperationService]
    });
  });

  it('should be created', inject([VoucherOperationService], (service: VoucherOperationService) => {
    expect(service).toBeTruthy();
  }));
});
