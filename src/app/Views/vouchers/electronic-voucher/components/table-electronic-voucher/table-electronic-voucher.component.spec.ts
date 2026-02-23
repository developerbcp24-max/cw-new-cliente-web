import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableElectronicVoucherComponent } from './table-electronic-voucher.component';

describe('TableElectronicVoucherComponent', () => {
  let component: TableElectronicVoucherComponent;
  let fixture: ComponentFixture<TableElectronicVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableElectronicVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableElectronicVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
