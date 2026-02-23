import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePasePaymentDetailComponent } from './service-pase-payment-detail.component';

describe('ServicePasePaymentDetailComponent', () => {
  let component: ServicePasePaymentDetailComponent;
  let fixture: ComponentFixture<ServicePasePaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePasePaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePasePaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
