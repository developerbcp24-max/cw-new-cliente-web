import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOldVouchersComponent } from './list-old-vouchers.component';

describe('ListOldVouchersComponent', () => {
  let component: ListOldVouchersComponent;
  let fixture: ComponentFixture<ListOldVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOldVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOldVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
