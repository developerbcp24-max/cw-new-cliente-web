import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFavoritePaymentDetailComponent } from './configuration-favorite-payment-detail.component';

describe('ConfigurationFavoritePaymentDetailComponent', () => {
  let component: ConfigurationFavoritePaymentDetailComponent;
  let fixture: ComponentFixture<ConfigurationFavoritePaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationFavoritePaymentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationFavoritePaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
