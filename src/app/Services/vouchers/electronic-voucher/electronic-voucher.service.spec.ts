import { TestBed, inject } from '@angular/core/testing';

import { ElectronicVoucherService } from './electronic-voucher.service';

describe('ElectronicVoucherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronicVoucherService]
    });
  });

  it('should be created', inject([ElectronicVoucherService], (service: ElectronicVoucherService) => {
    expect(service).toBeTruthy();
  }));
});
