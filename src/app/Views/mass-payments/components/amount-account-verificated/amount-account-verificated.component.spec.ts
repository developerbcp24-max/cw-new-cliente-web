import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountAccountVerificatedComponent } from './amount-account-verificated.component';

describe('AmountAccountVerificatedComponent', () => {
  let component: AmountAccountVerificatedComponent;
  let fixture: ComponentFixture<AmountAccountVerificatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountAccountVerificatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountAccountVerificatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
