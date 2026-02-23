import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAbroadStep2Component } from './transfer-abroad-step2.component';

describe('TransferAbroadStep2Component', () => {
  let component: TransferAbroadStep2Component;
  let fixture: ComponentFixture<TransferAbroadStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAbroadStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAbroadStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
