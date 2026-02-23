import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyConditionsComponent } from './company-conditions.component';

describe('CompanyConditionsComponent', () => {
  let component: CompanyConditionsComponent;
  let fixture: ComponentFixture<CompanyConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyConditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
