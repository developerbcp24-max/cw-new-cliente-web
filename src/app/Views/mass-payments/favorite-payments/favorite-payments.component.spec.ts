import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePaymentsComponent } from './favorite-payments.component';

describe('FavoritePaymentsComponent', () => {
  let component: FavoritePaymentsComponent;
  let fixture: ComponentFixture<FavoritePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoritePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
