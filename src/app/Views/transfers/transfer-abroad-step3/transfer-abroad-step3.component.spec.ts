import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAbroadStep3Component } from './transfer-abroad-step3.component';

describe('TransferAbroadStep3Component', () => {
  let component: TransferAbroadStep3Component;
  let fixture: ComponentFixture<TransferAbroadStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAbroadStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAbroadStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
