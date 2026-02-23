import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersByOperationComponent } from './vouchers-by-operation.component';

describe('VouchersByOperationComponent', () => {
  let component: VouchersByOperationComponent;
  let fixture: ComponentFixture<VouchersByOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VouchersByOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersByOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
