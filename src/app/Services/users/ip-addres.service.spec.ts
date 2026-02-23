import { TestBed } from '@angular/core/testing';

import { IpAddresService } from './ip-addres.service';

describe('IpAddresService', () => {
  let service: IpAddresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpAddresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
