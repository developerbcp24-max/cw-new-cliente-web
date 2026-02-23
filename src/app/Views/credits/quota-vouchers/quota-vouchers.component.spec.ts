import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaVouchersComponent } from './quota-vouchers.component';

describe('QuotaVouchersComponent', () => {
  let component: QuotaVouchersComponent;
  let fixture: ComponentFixture<QuotaVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotaVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
