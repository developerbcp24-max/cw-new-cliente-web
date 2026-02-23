import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersPaymentDetailComponent } from './providers-payment-detail.component';

describe('ProvidersPaymentDetailComponent', () => {
  let component: ProvidersPaymentDetailComponent;
  let fixture: ComponentFixture<ProvidersPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersPaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
