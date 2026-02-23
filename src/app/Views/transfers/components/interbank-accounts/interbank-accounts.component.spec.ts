import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterbankAccountsComponent } from './interbank-accounts.component';

describe('InterbankAccountsComponent', () => {
  let component: InterbankAccountsComponent;
  let fixture: ComponentFixture<InterbankAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterbankAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterbankAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
