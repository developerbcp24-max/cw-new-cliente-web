import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasePaymentDetailComponent } from './new-pase-payment-detail.component';

describe('NewPasePaymentDetailComponent', () => {
  let component: NewPasePaymentDetailComponent;
  let fixture: ComponentFixture<NewPasePaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPasePaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasePaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
