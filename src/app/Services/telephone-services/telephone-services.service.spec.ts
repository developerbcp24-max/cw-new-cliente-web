import { TestBed, inject } from '@angular/core/testing';

import { TelephoneServicesService } from './telephone-services.service';

describe('TelephoneServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TelephoneServicesService]
    });
  });

  it('should be created', inject([TelephoneServicesService], (service: TelephoneServicesService) => {
    expect(service).toBeTruthy();
  }));
});
