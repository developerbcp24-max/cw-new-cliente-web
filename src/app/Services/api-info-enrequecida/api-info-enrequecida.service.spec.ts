import { TestBed } from '@angular/core/testing';

import { ApiInfoEnrequecidaService } from './api-info-enrequecida.service';

describe('ApiInfoEnrequecidaService', () => {
  let service: ApiInfoEnrequecidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiInfoEnrequecidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
