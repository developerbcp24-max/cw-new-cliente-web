import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePaymentsDetailComponent } from './multiple-payments-detail.component';

describe('MultiplePaymentsDetailComponent', () => {
  let component: MultiplePaymentsDetailComponent;
  let fixture: ComponentFixture<MultiplePaymentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplePaymentsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplePaymentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
