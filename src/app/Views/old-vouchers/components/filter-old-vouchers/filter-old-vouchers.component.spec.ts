import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOldVouchersComponent } from './filter-old-vouchers.component';

describe('FilterOldVouchersComponent', () => {
  let component: FilterOldVouchersComponent;
  let fixture: ComponentFixture<FilterOldVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterOldVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterOldVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
