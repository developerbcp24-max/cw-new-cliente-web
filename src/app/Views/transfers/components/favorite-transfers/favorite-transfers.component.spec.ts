import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteTransfersComponent } from './favorite-transfers.component';

describe('FavoriteTransfersComponent', () => {
  let component: FavoriteTransfersComponent;
  let fixture: ComponentFixture<FavoriteTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteTransfersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
