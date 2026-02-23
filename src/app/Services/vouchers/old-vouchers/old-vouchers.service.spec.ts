import { TestBed, inject } from '@angular/core/testing';

import { OldVouchersService } from './old-vouchers.service';

describe('OldVouchersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OldVouchersService]
    });
  });

  it('should be created', inject([OldVouchersService], (service: OldVouchersService) => {
    expect(service).toBeTruthy();
  }));
});
