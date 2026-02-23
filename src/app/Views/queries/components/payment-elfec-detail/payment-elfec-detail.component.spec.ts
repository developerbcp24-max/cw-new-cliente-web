import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentElfecDetailComponent } from './payment-elfec-detail.component';

describe('PaymentElfecDetailComponent', () => {
  let component: PaymentElfecDetailComponent;
  let fixture: ComponentFixture<PaymentElfecDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentElfecDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentElfecDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
