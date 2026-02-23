import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrecuentTransferAbroadAddComponent } from './frecuent-transfer-abroad-add.component';

describe('FrecuentTransferAbroadAddComponent', () => {
  let component: FrecuentTransferAbroadAddComponent;
  let fixture: ComponentFixture<FrecuentTransferAbroadAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrecuentTransferAbroadAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrecuentTransferAbroadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
