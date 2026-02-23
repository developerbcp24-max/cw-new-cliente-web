import { TestBed } from '@angular/core/testing';

import { JwtFieldEncryptionService } from './jwt-field-encryption.service';

describe('JwtFieldEncryptionService', () => {
  let service: JwtFieldEncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtFieldEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
