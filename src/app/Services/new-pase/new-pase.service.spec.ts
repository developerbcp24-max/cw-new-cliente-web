import { TestBed, inject } from '@angular/core/testing';

import { NewPaseService } from './new-pase.service';

describe('NewPaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewPaseService]
    });
  });

  it('should be created', inject([NewPaseService], (service: NewPaseService) => {
    expect(service).toBeTruthy();
  }));
});
