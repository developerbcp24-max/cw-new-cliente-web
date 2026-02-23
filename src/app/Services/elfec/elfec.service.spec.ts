import { TestBed, inject } from '@angular/core/testing';

import { ElfecService } from './elfec.service';

describe('ElfecService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElfecService]
    });
  });

  it('should be created', inject([ElfecService], (service: ElfecService) => {
    expect(service).toBeTruthy();
  }));
});
