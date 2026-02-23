import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedCompanyLimitsComponent } from './depecrated-company-limits.component';

describe('DepecratedCompanyLimitsComponent', () => {
  let component: DepecratedCompanyLimitsComponent;
  let fixture: ComponentFixture<DepecratedCompanyLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedCompanyLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedCompanyLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
