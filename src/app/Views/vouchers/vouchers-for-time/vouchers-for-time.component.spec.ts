import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchersForTimeComponent } from './vouchers-for-time.component';

describe('VouchersForTimeComponent', () => {
  let component: VouchersForTimeComponent;
  let fixture: ComponentFixture<VouchersForTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VouchersForTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchersForTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
