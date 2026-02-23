import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldVouchersForTimeComponent } from './old-vouchers-for-time.component';

describe('OldVouchersForTimeComponent', () => {
  let component: OldVouchersForTimeComponent;
  let fixture: ComponentFixture<OldVouchersForTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldVouchersForTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldVouchersForTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
