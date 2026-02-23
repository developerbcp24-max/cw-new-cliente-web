import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersAccountDepositComponent } from './providers-account-deposit.component';

describe('ProvidersAccountDepositComponent', () => {
  let component: ProvidersAccountDepositComponent;
  let fixture: ComponentFixture<ProvidersAccountDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersAccountDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersAccountDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
