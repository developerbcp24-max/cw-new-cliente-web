import { TestBed, inject } from '@angular/core/testing';

import { ElectronicBillService } from './electronic-bill.service';

describe('ElectronicBillService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronicBillService]
    });
  });

  it('should be created', inject([ElectronicBillService], (service: ElectronicBillService) => {
    expect(service).toBeTruthy();
  }));
});
