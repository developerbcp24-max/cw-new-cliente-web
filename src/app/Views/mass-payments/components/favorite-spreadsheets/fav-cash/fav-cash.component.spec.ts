import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavCashComponent } from './fav-cash.component';

describe('FavCashComponent', () => {
  let component: FavCashComponent;
  let fixture: ComponentFixture<FavCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavCashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
