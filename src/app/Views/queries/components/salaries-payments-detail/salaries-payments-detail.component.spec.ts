import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariesPaymentsDetailComponent } from './salaries-payments-detail.component';

describe('SalariesPaymentsDetailComponent', () => {
  let component: SalariesPaymentsDetailComponent;
  let fixture: ComponentFixture<SalariesPaymentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalariesPaymentsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariesPaymentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
