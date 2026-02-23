import { TestBed, inject } from '@angular/core/testing';

import { ProvidersCheckManagementService } from './providers-check-management.service';

describe('ProvidersCheckManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvidersCheckManagementService]
    });
  });

  it('should be created', inject([ProvidersCheckManagementService], (service: ProvidersCheckManagementService) => {
    expect(service).toBeTruthy();
  }));
});
