import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAfpDetailComponent } from './payment-afp-detail.component';

describe('PaymentAfpDetailComponent', () => {
  let component: PaymentAfpDetailComponent;
  let fixture: ComponentFixture<PaymentAfpDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentAfpDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAfpDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
