import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliPaymentsComponent } from './soli-payments.component';

describe('SoliPaymentsComponent', () => {
  let component: SoliPaymentsComponent;
  let fixture: ComponentFixture<SoliPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoliPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoliPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
