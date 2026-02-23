import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardsMovementsComponent } from './credit-cards-movements.component';

describe('CreditCardsMovementsComponent', () => {
  let component: CreditCardsMovementsComponent;
  let fixture: ComponentFixture<CreditCardsMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardsMovementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardsMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
