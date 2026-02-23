import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersDepositInOtherBankCheckComponent } from './providers-deposit-in-other-bank-check.component';

describe('ProvidersDepositInOtherBankCheckComponent', () => {
  let component: ProvidersDepositInOtherBankCheckComponent;
  let fixture: ComponentFixture<ProvidersDepositInOtherBankCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersDepositInOtherBankCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersDepositInOtherBankCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
