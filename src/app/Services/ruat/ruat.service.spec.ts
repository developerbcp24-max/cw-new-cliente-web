import { TestBed, inject } from '@angular/core/testing';

import { RuatService } from './ruat.service';

describe('RuatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuatService]
    });
  });

  it('should be created', inject([RuatService], (service: RuatService) => {
    expect(service).toBeTruthy();
  }));
});
