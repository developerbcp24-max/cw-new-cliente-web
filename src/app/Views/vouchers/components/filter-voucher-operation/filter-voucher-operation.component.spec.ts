import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVoucherOperationComponent } from './filter-voucher-operation.component';

describe('FilterVoucherOperationComponent', () => {
  let component: FilterVoucherOperationComponent;
  let fixture: ComponentFixture<FilterVoucherOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterVoucherOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterVoucherOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
