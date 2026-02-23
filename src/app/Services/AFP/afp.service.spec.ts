import { TestBed, inject } from '@angular/core/testing';

import { AfpService } from './afp.service';

describe('AfpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AfpService]
    });
  });

  it('should be created', inject([AfpService], (service: AfpService) => {
    expect(service).toBeTruthy();
  }));
});
