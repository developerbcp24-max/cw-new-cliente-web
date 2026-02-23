import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicVoucherComponent } from './electronic-voucher.component';

describe('ElectronicVoucherComponent', () => {
  let component: ElectronicVoucherComponent;
  let fixture: ComponentFixture<ElectronicVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectronicVoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectronicVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
