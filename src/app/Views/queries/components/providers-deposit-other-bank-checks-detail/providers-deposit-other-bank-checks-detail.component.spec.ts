import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersDepositOtherBankChecksDetailComponent } from './providers-deposit-other-bank-checks-detail.component';

describe('ProvidersDepositOtherBankChecksDetailComponent', () => {
  let component: ProvidersDepositOtherBankChecksDetailComponent;
  let fixture: ComponentFixture<ProvidersDepositOtherBankChecksDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersDepositOtherBankChecksDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersDepositOtherBankChecksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
