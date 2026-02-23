import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBillDataComponent } from './send-bill-data.component';

describe('SendBillDataComponent', () => {
  let component: SendBillDataComponent;
  let fixture: ComponentFixture<SendBillDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendBillDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBillDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
