import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalariesPaymentsComponent } from './salaries-payments.component';

describe('SalariesPaymentsComponent', () => {
  let component: SalariesPaymentsComponent;
  let fixture: ComponentFixture<SalariesPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalariesPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalariesPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
