import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLimitsComponent } from './company-limits.component';

describe('CompanyLimitsComponent', () => {
  let component: CompanyLimitsComponent;
  let fixture: ComponentFixture<CompanyLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
