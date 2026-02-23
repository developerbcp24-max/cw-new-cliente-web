import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePaymentsComponent } from './multiple-payments.component';

describe('MultiplePaymentsComponent', () => {
  let component: MultiplePaymentsComponent;
  let fixture: ComponentFixture<MultiplePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
