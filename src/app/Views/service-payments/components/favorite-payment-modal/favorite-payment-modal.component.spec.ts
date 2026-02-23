import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePaymentModalComponent } from './favorite-payment-modal.component';

describe('FavoritePaymentModalComponent', () => {
  let component: FavoritePaymentModalComponent;
  let fixture: ComponentFixture<FavoritePaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritePaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
