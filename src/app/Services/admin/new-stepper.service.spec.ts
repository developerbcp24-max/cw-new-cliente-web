import { TestBed } from '@angular/core/testing';

import { NewStepperService } from './new-stepper.service';

describe('NewStepperService', () => {
  let service: NewStepperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewStepperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
