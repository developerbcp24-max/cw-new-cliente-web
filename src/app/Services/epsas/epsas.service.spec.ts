import { TestBed, inject } from '@angular/core/testing';

import { EpsasService } from './epsas.service';

describe('EpsasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EpsasService]
    });
  });

  it('should be created', inject([EpsasService], (service: EpsasService) => {
    expect(service).toBeTruthy();
  }));
});
