import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrecuentTransfersAbroadComponent } from './frecuent-transfers-abroad.component';

describe('FrecuentTransfersAbroadComponent', () => {
  let component: FrecuentTransfersAbroadComponent;
  let fixture: ComponentFixture<FrecuentTransfersAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrecuentTransfersAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrecuentTransfersAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
