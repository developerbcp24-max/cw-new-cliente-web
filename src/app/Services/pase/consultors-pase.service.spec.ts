import { TestBed, inject } from '@angular/core/testing';

import { ConsultorsPaseService } from './consultors-pase.service';

describe('ConsultorsPaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultorsPaseService]
    });
  });

  it('should be created', inject([ConsultorsPaseService], (service: ConsultorsPaseService) => {
    expect(service).toBeTruthy();
  }));
});
