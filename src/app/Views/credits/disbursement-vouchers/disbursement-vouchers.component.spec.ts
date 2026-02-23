import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementVouchersComponent } from './disbursement-vouchers.component';

describe('DisbursementVouchersComponent', () => {
  let component: DisbursementVouchersComponent;
  let fixture: ComponentFixture<DisbursementVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursementVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
