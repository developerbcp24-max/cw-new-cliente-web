import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVoucherOperationComponent } from './list-voucher-operation.component';

describe('ListVoucherOperationComponent', () => {
  let component: ListVoucherOperationComponent;
  let fixture: ComponentFixture<ListVoucherOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListVoucherOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVoucherOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
