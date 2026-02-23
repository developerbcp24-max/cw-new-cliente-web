import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersByBatchComponent } from './vouchers-by-batch.component';

describe('VouchersByBatchComponent', () => {
  let component: VouchersByBatchComponent;
  let fixture: ComponentFixture<VouchersByBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VouchersByBatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersByBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
