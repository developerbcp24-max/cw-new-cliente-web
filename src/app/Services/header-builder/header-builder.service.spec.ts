import { TestBed } from '@angular/core/testing';

import { HeaderBuilderService } from './header-builder.service';

describe('HeaderBuilderService', () => {
  let service: HeaderBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
