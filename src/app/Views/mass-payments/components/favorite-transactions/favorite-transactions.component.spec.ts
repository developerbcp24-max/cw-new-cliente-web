import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteTransactionsComponent } from './favorite-transactions.component';

describe('FavoriteTransactionsComponent', () => {
  let component: FavoriteTransactionsComponent;
  let fixture: ComponentFixture<FavoriteTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
