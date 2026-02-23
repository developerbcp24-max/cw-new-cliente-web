import { TestBed, inject } from '@angular/core/testing';

import { ApproversAndControllersService } from './approversandcontrollers.service';

describe('ApproversandcontrollersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApproversAndControllersService]
    });
  });

  it('should be created', inject([ApproversAndControllersService], (service: ApproversAndControllersService) => {
    expect(service).toBeTruthy();
  }));
});
