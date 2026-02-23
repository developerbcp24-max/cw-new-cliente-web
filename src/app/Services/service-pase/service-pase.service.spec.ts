import { TestBed, inject } from '@angular/core/testing';

import { ServicePaseService } from './service-pase.service';

describe('ServicePaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicePaseService]
    });
  });

  it('should be created', inject([ServicePaseService], (service: ServicePaseService) => {
    expect(service).toBeTruthy();
  }));
});
