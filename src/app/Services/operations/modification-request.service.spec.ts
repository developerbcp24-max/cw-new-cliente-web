import { TestBed, inject } from '@angular/core/testing';

import { ModificationRequestService } from './modification-request.service';

describe('ModificationRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModificationRequestService]
    });
  });

  it('should be created', inject([ModificationRequestService], (service: ModificationRequestService) => {
    expect(service).toBeTruthy();
  }));
});
